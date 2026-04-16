import { Request, Response } from 'express';
import { generateNutritionPlan } from '../services/nutritionService';
import User from '../models/User';

export async function handleNutritionPlan(req: Request, res: Response) {
  const userId = (req as any).user.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const updatedUser = await generateNutritionPlan(userId, req.body);
    res.status(200).json({
      message: 'Nutrition plan created',
      nutritionPlan: updatedUser.nutritionPlan,
    });
  } catch (err: any) {
    console.error('NUTRITION ERROR:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate nutrition plan' });
  }
}

export async function getNutritionPlan(req: Request, res: Response) {
  const userId = (req as any).user.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = await User.findById(userId).select('nutritionPlan');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ nutritionPlan: user.nutritionPlan });
  } catch (err: any) {
    console.error('GET NUTRITION ERROR:', err.message);
    res.status(500).json({ message: 'Failed to fetch nutrition plan' });
  }
}
