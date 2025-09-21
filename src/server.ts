import dotenv from 'dotenv';
dotenv.config();

import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import authRoutes from './routes/auth';
import setUpRoutes from './routes/setup';
import profileRoutes from './routes/profile';

import { connectToMongoDB } from './api/utils/connectToMongo';
import corsOptions from './configs/corsOptions';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import cookieParser from 'cookie-parser';
import path from 'path';


const app = express();
const PORT = process.env.PORT;

app.use(cors(corsOptions) as RequestHandler);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);


app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// Import routes


app.use('/auth', authRoutes);
app.use('/setup', setUpRoutes);
app.use('/profile', profileRoutes);

app.use(notFound);
app.use(errorHandler);

connectToMongoDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });
