import { CorsOptions } from 'cors';

const allowedOrigins = [
  // Production
  process.env.FRONTEND_PROD || 'https://www.ai-workout.co.il',
  'https://www.ai-workout.co.il',
  'https://ai-workout.co.il',

  // Development (Local)
  process.env.FRONTEND_DEV || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173', // Vite (אם תעבור)
].filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

export default corsOptions;
