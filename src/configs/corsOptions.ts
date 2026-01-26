import { CorsOptions } from 'cors';

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_PROD]
    : [
        process.env.FRONTEND_DEV,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://main.d2xdu67sdghkgu.amplifyapp.com'
      ];

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
