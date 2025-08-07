import express from 'express';
import { register, login, logout, getAuthenticatedUser } from '../api/controller/authController';
import { loginValidation, signupValidation, } from '../api/validations';

const router = express.Router();
router.post('/register', signupValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/user', getAuthenticatedUser );
export default router;
