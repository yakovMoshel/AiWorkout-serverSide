"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelist = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_PROD]
    : [process.env.FRONTEND_DEV];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
exports.default = corsOptions;
