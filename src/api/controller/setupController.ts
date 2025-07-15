import { Request, Response } from 'express';
import {  generateWorkoutPlan } from '../services/setupService';

export async function handleSetupAndPlan(req: Request, res: Response) {
  const userId = (req as any).user.id;

  if (!userId) {
     res.status(401).json({ message: 'Unauthorized' });
     return;
  }
    
try {
    const updatedUser = await generateWorkoutPlan(userId, req.body);
    res.status(200).json({
      message: 'Profile saved and workout plan created',
      workoutPlan: updatedUser.workoutPlan,
    });
} catch (err: any) {
  console.error("AXIOS ERROR:", err.response?.data || err.message);
  res.status(500).json({ message: 'Failed to save data or generate workout plan' });
}
}


// export async function handleWorkoutStatus(req: Request, res: Response) {
//   const userId = (req as any).user.id;

//   try {
//     const planStatus = await getWorkoutPlanStatus(userId);
//     console.log("Workout Plan Status:", planStatus);
//     res.status(200).json({ workoutPlan: planStatus });
//   } catch (err: any) {
//     console.error("Workout Status Error:", err.message);
//     res.status(500).json({ message: err.message || 'Failed to check workout plan status' });
//   }
// }