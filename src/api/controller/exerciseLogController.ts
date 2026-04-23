import { Request, Response } from 'express';
import ExerciseLog from '../models/ExerciseLog';

export async function logExercise(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { exerciseName, sets } = req.body as {
    exerciseName: string;
    sets: { weight: number; reps: number }[];
  };

  if (!exerciseName || !Array.isArray(sets) || sets.length === 0) {
    res.status(400).json({ message: 'exerciseName and sets are required' });
    return;
  }

  const sessionPr = Math.max(...sets.map((s) => s.weight));

  const existing = await ExerciseLog.findOne({ userId, exerciseName }).sort({ date: -1 });
  const newPr = existing ? Math.max(existing.pr, sessionPr) : sessionPr;

  const log = await ExerciseLog.create({ userId, exerciseName, sets, pr: newPr });
  res.status(201).json({ log, pr: newPr });
}

export async function getExerciseLog(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const exerciseName = decodeURIComponent(req.params.exerciseName);

  const log = await ExerciseLog.findOne({ userId, exerciseName }).sort({ date: -1 });
  res.json({ sets: log?.sets ?? [], pr: log?.pr ?? 0 });
}
