import express from 'express';
import { handleAiChat } from '../api/controller/aiController';

const router = express.Router();

router.post('/chat', (req, res, next) => {
  Promise.resolve(handleAiChat(req, res)).catch(next);
});

export default router;
