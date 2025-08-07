import { Request, RequestHandler, Response } from 'express';
import { getUserFromToken, loginUser, registerUser } from '../services/authService';
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


export const getAuthenticatedUser: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: 'No token found' });
      return;
    }
    const user = await getUserFromToken(token);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};