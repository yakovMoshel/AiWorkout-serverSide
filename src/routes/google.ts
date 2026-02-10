import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { connectGoogle, createWorkoutEvents, googleCallback } from '../api/controller/googleController';

const router = Router();

// התחברות ל־Google
router.get('/connect', connectGoogle);

// callback מ־Google
router.get('/callback', authenticate, googleCallback);

router.post('/create-workout-events', authenticate, createWorkoutEvents);
  

export default router;

