import express from 'express';
import {ratelimit} from './rate_limiter/ratelimit.js'
import cors from 'cors';
import dotenv from 'dotenv';
import {connectToDatabase} from './db/init.js';

import auth from './routes/auth/auth.js';
import clip from './routes/clip/clip.js';

dotenv.config();
const app = express();
await connectToDatabase();

const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
    exposedHeaders: ['new-access-token', 'new-refresh-token']
}));


app.use(ratelimit);

app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway');
});

app.use('/auth', express.json() , auth);
app.use('/clip', clip);

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});