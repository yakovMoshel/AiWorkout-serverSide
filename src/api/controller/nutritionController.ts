import { Request, Response } from 'express';
import { generateNutritionPlan } from '../services/nutritionService';
import User from '../models/User';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function buildWeeklyMealPlan(mealSuggestions: any[]): Record<string, Record<string, any>> {
  const weeklyMealPlan: Record<string, Record<string, any>> = {};

  DAYS.forEach((day, dayIndex) => {
    weeklyMealPlan[day] = {};
    for (const mealGroup of mealSuggestions) {
      const suggestions: any[] = mealGroup.suggestions ?? [];
      if (suggestions.length === 0) continue;
      const suggestion = suggestions[dayIndex % suggestions.length];
      weeklyMealPlan[day][mealGroup.meal] = suggestion ?? null;
    }
  });

  return weeklyMealPlan;
}

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

    const nutritionPlan = user.nutritionPlan;
    // GPT returns flat structure; RapidAPI (legacy) wrapped in .result
    const mealSuggestions =
      nutritionPlan?.meal_suggestions ??
      nutritionPlan?.result?.meal_suggestions ??
      [];
    const weeklyMealPlan = mealSuggestions.length > 0
      ? buildWeeklyMealPlan(mealSuggestions)
      : null;

    res.status(200).json({ nutritionPlan, weeklyMealPlan });
  } catch (err: any) {
    console.error('GET NUTRITION ERROR:', err.message);
    res.status(500).json({ message: 'Failed to fetch nutrition plan' });
  }
}
