import express from 'express';
import { register, login, logout } from '../api/controller/authController';
import { loginValidation, signupValidation, } from '../api/validations';

const router = express.Router();
router.post('/register', signupValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

export default router;
