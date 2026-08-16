import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ratelimit } from './rate_limiter/ratelimit.js';
import { connectToDatabase } from './db/init.js';

import auth from './routes/auth/auth.js';
import clip from './routes/clip/clip.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Connect to MongoDB
await connectToDatabase();

// ✅ Dynamic CORS setup
const allowedOrigins = [
  'https://zipp-client2.vercel.app', // vercel
  'https://zipp.piyx.me',  // your live site
  'http://localhost:5173'       // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow mobile apps / Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  exposedHeaders: ['new-access-token', 'new-refresh-token']
}));

// ✅ Middleware
app.use(express.json());
app.use(ratelimit);

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API Gateway 🚀');
});

app.use('/auth', auth);
app.use('/clip', clip);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});
