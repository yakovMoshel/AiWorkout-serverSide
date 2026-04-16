import express from 'express';
import { handleSetupAndPlan } from '../api/controller/setupController';
import { authenticate } from '../middleware/auth';
import { getWorkoutPlan } from '../api/controller/workoutController';
import { handleNutritionPlan, getNutritionPlan } from '../api/controller/nutritionController';

const router = express.Router();

router.post('/workout', authenticate, handleSetupAndPlan);
router.get('/workout', authenticate, getWorkoutPlan);
router.post('/nutrition', authenticate, handleNutritionPlan);
router.get('/nutrition', authenticate, getNutritionPlan);

export default router;
