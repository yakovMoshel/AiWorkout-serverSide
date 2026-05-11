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
import aiRoutes from './routes/chatAi';
import exerciseRoutes from './routes/exercise';
import pushRoutes from './routes/push';

import { connectToMongoDB } from './api/utils/ConnectToMongo';
import corsOptions from './configs/corsOptions';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import cookieParser from 'cookie-parser';
import webpush from 'web-push';
import { startWorkoutReminderCron } from './cron/workoutReminder';


export const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (process.env.NODE_ENV !== 'test') {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}


app.set('trust proxy', 1);
app.use(cors(corsOptions) as RequestHandler);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", process.env.SERVER_URL || ""],
        connectSrc: ["'self'", process.env.FRONTEND_PROD || "", process.env.FRONTEND_DEV || ""],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);


app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
app.use('/ai', aiRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/push', pushRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectToMongoDB().then(() => {
    startWorkoutReminderCron();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  });
}
