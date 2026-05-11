import express, { Request, Response, NextFunction } from 'express';
import { logExercise, getExerciseLog } from '../api/controller/exerciseLogController';
import { authenticate } from '../middleware/auth';
import { exerciseLogValidation } from '../api/validations';
import { validationResult } from 'express-validator';

const router = express.Router();

function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  next();
}

router.post('/log', authenticate, exerciseLogValidation, validate, (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(logExercise(req, res)).catch(next);
});

router.get('/log/:exerciseName', authenticate, (req, res, next) => {
  Promise.resolve(getExerciseLog(req, res)).catch(next);
});

export default router;
