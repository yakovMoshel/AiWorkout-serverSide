import express from 'express';
import { handleSetupAndPlan } from '../api/controller/setupController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/workout', authenticate, handleSetupAndPlan);
// router.get('/status', authenticate, handleWorkoutStatus);
    
export default router;
