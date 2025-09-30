import { Request, Response } from 'express';
import User from '../models/User';

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = (req as Request & { file?: Express.Multer.File }).file;
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    const { name, weight, goal } = req.body;

    const update: any = {};
    if (name) update.name = name;
    if (weight) update.weight = weight;
    if (goal) update.goal = goal;
    if (imageUrl) update.image = imageUrl;

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.image) {
      user.image = `${process.env.SERVER_URL}${user.image}`;
    }

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
