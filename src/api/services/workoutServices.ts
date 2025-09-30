import User from '../models/User';
import { IUser } from '../types/user';

export async function fetchUserWorkoutPlan(userId: string): Promise<IUser['workoutPlan']> {
  const user = await User.findById(userId);
  
  if (!user || !user.workoutPlan) {
    throw new Error("Workout plan not found");
  }

  return user.workoutPlan;
}
