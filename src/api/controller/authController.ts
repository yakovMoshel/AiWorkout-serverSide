
import { Request, RequestHandler, Response, NextFunction } from 'express';
import { getUserFromToken, loginUser, registerUser } from '../services/authService';
import { sendTokenAsCookie } from '../../middleware/auth';
import { validationResult } from "express-validator";

export const register: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    const { email, password, name } = req.body;
    const { user, token } = await registerUser(email, password, name);
    sendTokenAsCookie(res, token);
    res.status(201).json({
      message: 'User registered successfully',
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
};


export const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    sendTokenAsCookie(res, token);
    res.json({
      message: 'Login successful',
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
};


export const logout: RequestHandler = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};



export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
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
    next(err);
  }
};
