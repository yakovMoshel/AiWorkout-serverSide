import { Request, Response } from 'express';
import { createAiChatReply } from '../services/aiService';

export async function handleAiChat(req: Request, res: Response) {
  try {
    const { message } = req.body as { message?: string };

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await createAiChatReply(message.trim());
    console.log("HEADERS:", req.headers);
console.log("BODY:", req.body);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('AI error:', err);
    return res.status(500).json({ error: 'AI error' });
  }
}
