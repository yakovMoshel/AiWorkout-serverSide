import express from 'express';
import { handleSetupAndPlan } from '../api/controller/setupController';
import { authenticate } from '../middleware/auth';
import { getWorkoutPlan } from '../api/controller/workoutController';

const router = express.Router();

router.post('/workout', authenticate, handleSetupAndPlan);
router.get('/workout', authenticate, getWorkoutPlan)  
export default router;
