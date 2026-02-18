import express from 'express';
import { handleAiChat } from '../api/controller/aiController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/chat', authenticate, (req, res, next) => {
  Promise.resolve(handleAiChat(req, res)).catch(next);
});

export default router;
