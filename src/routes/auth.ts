import express from 'express';
import { register, login } from '../api/controller/authController';
import { loginValidation, signupValidation, } from '../api/validations';

const router = express.Router();

router.post('/register', signupValidation, register);
router.post('/login', loginValidation, login);

export default router;
