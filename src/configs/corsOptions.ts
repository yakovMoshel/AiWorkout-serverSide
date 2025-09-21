import { CorsOptions } from 'cors';

const aiWorkOut = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_PROD]
  : [process.env.FRONTEND_DEV];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || aiWorkOut.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
