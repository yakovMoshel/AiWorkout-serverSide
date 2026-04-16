import axios from 'axios';
import User from '../models/User';
import { IUser } from '../types/user';

interface NutritionFormInput {
  goal: string;
  weight: number;
  targetWeight?: number;
  dietaryRestrictions?: string[];
  activityLevel?: string;
}

const goalMap: Record<string, string> = {
  weight_loss: 'Lose weight',
  muscle_gain: 'Gain muscle',
  endurance: 'Improve endurance',
};

export async function generateNutritionPlan(
  userId: string,
  formData: NutritionFormInput
): Promise<IUser> {
  const {
    goal,
    weight,
    targetWeight,
    dietaryRestrictions = [],
    activityLevel = 'Moderate',
  } = formData;

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const options = {
    method: 'POST',
    url: 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice',
    params: { noqueue: '1' },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY || '',
      'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      goal: goalMap[goal] || goal,
      dietary_restrictions: dietaryRestrictions.filter((r) => r !== 'None'),
      current_weight: weight,
      target_weight: targetWeight ?? weight,
      daily_activity_level: activityLevel,
      lang: 'en',
    },
  };

  const response = await axios.request(options);
  const nutritionPlan = response.data;

  await User.findByIdAndUpdate(userId, { $set: { nutritionPlan } });

  return { ...user.toObject(), nutritionPlan } as IUser;
}
