import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import authRoutes from './routes/auth';
import setUpRoutes from './routes/setup';
import profileRoutes from './routes/profile';
import googleRoutes from './routes/google';

import { connectToMongoDB } from './api/utils/ConnectToMongo';
import corsOptions from './configs/corsOptions';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import cookieParser from 'cookie-parser';


export const app = express();
  const PORT = Number(process.env.PORT) || 5000;


app.set('trust proxy', 1);
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
app.use('/google', googleRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectToMongoDB().then(() => {

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

  });
}
