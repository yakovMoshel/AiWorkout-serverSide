import { Request, Response } from 'express';
import { fetchUserWorkoutPlan } from '../services/workoutServices';

export async function getWorkoutPlan(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  try {
    const workoutPlan = await fetchUserWorkoutPlan(userId);
    res.status(200).json({ workoutPlan });
  } catch (err: any) {
    console.error('Error fetching workout plan:', err.message);
    res.status(404).json({ message: err.message || 'Workout plan not found' });
  }
}
