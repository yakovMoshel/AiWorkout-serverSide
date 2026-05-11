import express from 'express';
import { handleSetupAndPlan } from '../api/controller/setupController';
import { authenticate } from '../middleware/auth';
import { getWorkoutPlan } from '../api/controller/workoutController';
import { handleNutritionPlan, getNutritionPlan } from '../api/controller/nutritionController';
import {
  workoutSetupValidation,
  nutritionSetupValidation,
} from '../api/validations';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  next();
}

router.post('/workout', authenticate, workoutSetupValidation, validate, handleSetupAndPlan);
router.get('/workout', authenticate, getWorkoutPlan);
router.post('/nutrition', authenticate, nutritionSetupValidation, validate, handleNutritionPlan);
router.get('/nutrition', authenticate, getNutritionPlan);

export default router;
