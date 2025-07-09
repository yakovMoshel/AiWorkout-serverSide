import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { generateToken } from '../../middleware/auth';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    const token = generateToken(user);
    console.log(token)
    res.status(201).json({ message: 'User registered', user: { id: user._id, email: user.email, token } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}