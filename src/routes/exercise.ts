import express from 'express';
import { logExercise, getExerciseLog } from '../api/controller/exerciseLogController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/log', authenticate, (req, res, next) => {
  Promise.resolve(logExercise(req, res)).catch(next);
});

router.get('/log/:exerciseName', authenticate, (req, res, next) => {
  Promise.resolve(getExerciseLog(req, res)).catch(next);
});

export default router;
