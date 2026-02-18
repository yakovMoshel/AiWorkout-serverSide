import { Request, Response } from 'express';
import { createAiChatReply } from '../services/aiService';
import User from '../models/User'; // ה-model שלך

const AI_LIMIT = 10;

export async function handleAiChat(req: Request, res: Response) {
  try {
    const { message } = req.body as { message?: string };

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userId = (req as any).user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const aiUsage = user.aiUsage ?? 0;
    if (aiUsage >= AI_LIMIT) {
      return res.status(403).json({ error: 'Free AI messages finished. Upgrade soon 😉' });
    }

    const reply = await createAiChatReply(message.trim());

    user.aiUsage = aiUsage + 1;
    await user.save();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('AI error:', err);
    return res.status(500).json({ error: 'AI error' });
  }
}