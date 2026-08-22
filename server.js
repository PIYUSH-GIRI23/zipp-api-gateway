import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ratelimit } from './rate_limiter/ratelimit.js';
import { connectToDatabase } from './db/init.js';

import authRoute from './routes/authRoute.js';
import clipRoute from './routes/clipRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 1. Hide framework details
app.disable('x-powered-by');

// 2. Set security headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "https:", "http:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    frameguard: { action: 'deny' },
  })
);

// 3. Prevent search engine crawlers from indexing API endpoints
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /');
});

// 4. Dynamic CORS setup
const allowedOrigins = [
  'https://zipp.piyx.me',
  process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, '') : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Blocked by CORS policy: Origin not allowed.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-real-ip', 'x-forwarded-for', 'cf-connecting-ip'],
  credentials: true,
  exposedHeaders: ['new-access-token', 'new-refresh-token'],
  maxAge: 86400,
}));

// 5. Middleware & Payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(ratelimit);

// 6. Status & Health routes
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zipp API Gateway is running 🚀',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 7. Microservice routes
app.use('/auth', authRoute);
app.use('/clip', clipRoute);

// 8. Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 9. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Gateway error:', err && err.message ? err.message : err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : (err.message || 'Internal server error')
  });
});

// 10. Start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`✅ API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ API Gateway startup error:', error);
    process.exit(1);
  }
}

startServer();
