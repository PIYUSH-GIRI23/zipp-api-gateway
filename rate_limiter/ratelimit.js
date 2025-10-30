import Redis from "ioredis";
import 'dotenv/config';
import {getAuthCollection} from '../db/init.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
// -------------------------
// Redis connection
// -------------------------
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 5000,          // 5 second connection timeout
    commandTimeout: 3000,          // 3 second command timeout
    retryDelayOnFailover: 100,     // Fast failover
    maxRetriesPerRequest: 1,       // Don't retry commands, fail fast
    lazyConnect: true,             // Don't connect immediately
    keepAlive: 30000,              // Keep connection alive
});

redis.on('connect', () => { 
    console.log("✅ Redis connected successfully");
    redisAvailable = true;
    inMemoryCache.clear();
});

redis.on('error', (err) => { 
    console.error("❌ Redis connection error:", err.message);
    redisAvailable = false; 
});

redis.on('close', () => {
    console.log("🔌 Redis connection closed");
    redisAvailable = false;
});

redis.on('reconnecting', () => {
    console.log("🔄 Redis reconnecting...");
    redisAvailable = false;
});


const inMemoryCache = new Map();
let redisAvailable = true;

async function safeRedisOperation(operation, fallback) {
    try {
        if (!redisAvailable) {
            throw new Error("Redis unavailable");
        }
        
        const result = await Promise.race([
            operation(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Redis operation timeout')), 2000)
            )
        ]);
        return result;
    } 
    catch (error) {
        console.error("Redis error, using in-memory fallback:", error.message);
        redisAvailable = false;

        if (error.message === "Redis unavailable") {
            inMemoryCache.clear();
        }
        
        return fallback ? fallback() : null;
    }
}

const GLOBAL_LIMIT = parseInt(process.env.GLOBAL_LIMIT) || 5000;
const blockTimes = [
  15 * 60 * 1000,       // 15 min
  30 * 60 * 1000,       // 30 min
  60 * 60 * 1000,       // 1 hr
  24 * 60 * 60 * 1000,  // 24 hr
  -1                    // permanent
];
const BUCKET_TTL = parseInt(process.env.BUCKET_TTL) || 3600;

const ratePolicies = {
    auth: { limit: parseInt(process.env.AUTH_LIMIT) || 10, refillRate: (parseInt(process.env.AUTH_LIMIT) || 10)/60 },
    clip: { limit: parseInt(process.env.CLIP_LIMIT) || 50, refillRate: (parseInt(process.env.CLIP_LIMIT) || 50)/60 },
    default: { limit: 20, refillRate: 20/60 }
};


const whitelist = new Set((process.env.WHITELIST || "").split(",").filter(Boolean));
const blacklist = new Set((process.env.BLACKLIST || "").split(",").filter(Boolean));


async function getClientKey(req) {
  const authCollection = getAuthCollection();
  let id=req.ip;
  if(req.headers['token']){
      const token = JSON.parse(req.headers['token']).access_token;
      try{
          const decoded = jwt.verify(token , process.env.JWT_SECRET);
          const user = await  authCollection.findOne({_id: new ObjectId(decoded.userId)});
          if(user){
            
              id = user._id.toString();
          }
      }
      catch(err){
        id=req.ip;
      }
    }
  return id;
}
  
function getApiName(req) {
  if (req.path.startsWith("/auth")) return "auth";
  if (req.path.startsWith("/clip")) return "clip";
  return "default";
}

function getBlockDuration(offenseCount) {
  const index = Math.min(offenseCount - 1, blockTimes.length - 1);
  return blockTimes[index];
}

function logEvent(type, clientKey, api, info = "") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] User: ${clientKey}, API: ${api} ${info}`);
}

function isWhitelisted(clientKey) {
  return whitelist.has(clientKey);
}

function isBlacklisted(clientKey) {
  return blacklist.has(clientKey);
}

function setRateLimitHeaders(res, policy, availableTokens, bucket) {
  const resetTime = new Date(bucket.lastRefill + 60000).toISOString();
  res.set({
    'X-RateLimit-Limit': policy.limit,
    'X-RateLimit-Remaining': Math.max(0, availableTokens),
    'X-RateLimit-Reset': resetTime
  });
}


export async function ratelimit(req, res, next) {
    const clientKey = await getClientKey(req);
    const api = getApiName(req);
    const policy = ratePolicies[api] || ratePolicies.default;

    if (isWhitelisted(clientKey)) {
        logEvent("WHITELISTED", clientKey, api, "bypassing rate limit");
        return next();
    }

    if (isBlacklisted(clientKey)) {
        logEvent("BLACKLISTED", clientKey, api, "blocked");
        return res.status(429).json({ 
            error: "Access denied", 
            type: "blacklisted" 
        });
    }

    const now = await safeRedisOperation(
        async () => {
            const redisTime = await redis.time();
            return Number(redisTime[0]) * 1000 + Math.floor(redisTime[1]/1000);
        },
        () => Date.now()
    );

    const blockKey = `block:${clientKey}`;
    const blockData = await safeRedisOperation(
        () => redis.get(blockKey),
        () => inMemoryCache.get(blockKey)
    );
    
    if (blockData) {
        const block = typeof blockData === 'string' ? JSON.parse(blockData) : blockData;
        if (block.expires === -1) {
            logEvent("BLOCKED", clientKey, api, "permanently blocked");
            return res.status(429).json({ 
                error: "You are permanently blocked", 
                type: "permanent" 
            });
        } else if (now < block.expires) {
            const remainingMs = block.expires - now;
            const remainingMin = Math.ceil(remainingMs / 60000);
            logEvent("BLOCKED", clientKey, api, `blocked temporarily for ${remainingMin} min`);
            return res.status(429).json({ 
                error: `You are temporarily blocked for ${remainingMin} min`, 
                type: "temporary", 
                remainingMin 
            });
        }
    }

    // Global server limit with fallback
    const globalKey = "global_rate_limit";
    const globalCount = await safeRedisOperation(
        async () => {
            const count = await redis.incr(globalKey);
            if (count === 1) await redis.expire(globalKey, 1);
            return count;
        },
        () => {
            const current = inMemoryCache.get(globalKey) || 0;
            const newCount = current + 1;
            inMemoryCache.set(globalKey, newCount);
            setTimeout(() => inMemoryCache.delete(globalKey), 1000);
            return newCount;
        }
    );
    
    if (globalCount > GLOBAL_LIMIT) {
        logEvent("GLOBAL_LIMIT", clientKey, api, "Server overloaded");
        return res.status(503).json({ error: "Server overloaded, try later" });
    }

    // Per-user per-API token bucket with fallback
    const bucketKey = `rate_limit:${clientKey}:${api}`;
    let bucket = await safeRedisOperation(
        () => redis.get(bucketKey),
        () => inMemoryCache.get(bucketKey)
    );

    if (!bucket) {
        bucket = { tokens: policy.limit, lastRefill: now };
    } 
    else {
        bucket = typeof bucket === 'string' ? JSON.parse(bucket) : bucket;
        const elapsed = (now - bucket.lastRefill)/1000;
        const refill = elapsed * policy.refillRate;
        bucket.tokens = Math.min(policy.limit, bucket.tokens + refill);
        bucket.lastRefill = now;
    }

    const availableTokens = Math.floor(bucket.tokens);

    // Set rate limit headers
    setRateLimitHeaders(res, policy, availableTokens, bucket);

    if (availableTokens > 0) {
        bucket.tokens = availableTokens - 1;
        
        // Store updated bucket with fallback
        await safeRedisOperation(
            () => redis.set(bucketKey, JSON.stringify(bucket), "EX", BUCKET_TTL),
            () => {
                inMemoryCache.set(bucketKey, bucket);
                setTimeout(() => inMemoryCache.delete(bucketKey), BUCKET_TTL * 1000);
            }
        );
        
        return next();
    }

    // User exceeded limit → progressive block
    let offense = 1;
    if (blockData) {
        const block = typeof blockData === 'string' ? JSON.parse(blockData) : blockData;
        offense = Math.min(block.count + 1, blockTimes.length);
    }
    
    const blockDuration = getBlockDuration(offense);
    const expires = blockDuration === -1 ? -1 : now + blockDuration;
    const blockInfo = { count: offense, expires };

    // Store block with TTL and fallback
    await safeRedisOperation(
        async () => {
            if (blockDuration === -1) {
                await redis.set(blockKey, JSON.stringify(blockInfo));
            } else {
                await redis.set(blockKey, JSON.stringify(blockInfo), "EX", Math.ceil(blockDuration/1000));
            }
        },
        () => {
            inMemoryCache.set(blockKey, blockInfo);
            if (blockDuration !== -1) {
                setTimeout(() => inMemoryCache.delete(blockKey), blockDuration);
            }
        }
    );

    logEvent("RATE_LIMIT_EXCEEDED", clientKey, api, `Offense=${offense}, blocked until ${expires===-1 ? "permanent" : new Date(expires).toISOString()}`);

    return res.status(429).json({
        error: blockDuration === -1 
            ? "You are permanently blocked" 
            : `Rate limit exceeded for ${api}. You are blocked for ${Math.ceil(blockDuration/60000)} min`,
        type: blockDuration === -1 ? "permanent" : "temporary",
        remainingMin: blockDuration === -1 ? null : Math.ceil(blockDuration/60000)
    });
}
