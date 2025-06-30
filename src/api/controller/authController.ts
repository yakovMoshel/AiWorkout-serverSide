import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered', user: { id: user._id, email: user.email } });
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