import { CorsOptions } from 'cors';

const allowedOrigins = [
  // Production
  process.env.FRONTEND_PROD || 'https://aiworkout.co.il',
  'https://www.aiworkout.co.il',
  
  // Development
  process.env.FRONTEND_DEV || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173', // Vite
  
  // Staging/Other
  'https://main.d2xdu67sdghkgu.amplifyapp.com',
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
