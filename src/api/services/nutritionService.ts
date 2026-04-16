import User from '../models/User';
import { IUser } from '../types/user';
import { getOpenAIClient } from '../../configs/OpenAI';

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

  const openai = getOpenAIClient();

  const restrictions = dietaryRestrictions.filter((r) => r !== 'None');
  const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : 'None';

  const userPrompt = `Create a 7-day nutrition plan for someone with these details:
- Goal: ${goalMap[goal] || goal}
- Current weight: ${weight}kg
- Target weight: ${targetWeight ?? weight}kg
- Activity level: ${activityLevel}
- Dietary restrictions: ${restrictionsText}

Return ONLY this JSON structure, nothing else:
{
  "calories_per_day": number,
  "macronutrients": {
    "carbohydrates": "string (percentage)",
    "proteins": "string (percentage)",
    "fats": "string (percentage)"
  },
  "meal_suggestions": [
    {
      "meal": "string (e.g. Breakfast)",
      "suggestions": [
        {
          "name": "string",
          "ingredients": ["string"],
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number
        }
      ]
    }
  ],
  "tips": ["string"]
}

Include exactly 6 meals: Breakfast, Mid-Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack.
Include exactly 7 suggestions per meal (one per day of the week).`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a certified nutritionist. Return ONLY valid JSON, no markdown, no explanation.',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    max_tokens: 4000,
  });

  const raw = response.choices[0]?.message?.content ?? '{}';
  const nutritionPlan = JSON.parse(raw);

  await User.findByIdAndUpdate(userId, { $set: { nutritionPlan } });

  return { ...user.toObject(), nutritionPlan } as IUser;
}
