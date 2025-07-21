import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/authService';
import { sendTokenAsCookie } from '../../middleware/auth';

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  try {
    const { user, token } = await registerUser(email, password, name);
    sendTokenAsCookie(res, token);
    res.status(201).json({
      message: 'User registered successfully',
      user: { email: user.email, name: user.name },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser(email, password);
    sendTokenAsCookie(res, token);
    res.json({
      message: 'Login successful',
      user: { email: user.email, name: user.name },
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

