import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import authRoutes from './routes/auth';
import setUpRoutes from './routes/setup';

import { connectToMongoDB } from './api/utils/connectToMongo';
import corsOptions from './configs/corsOptions';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

// Import routes
app.use('/auth', authRoutes);
app.use('/setup',setUpRoutes );

app.use(notFound);
app.use(errorHandler);

connectToMongoDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });
