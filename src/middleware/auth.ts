import jwt from 'jsonwebtoken';
import {  Response,  RequestHandler } from 'express';
import { IUser } from '../api/types/user';
import { JwtPayload } from '../api/types/JwtPayload';

const JWTSECRET = process.env.JWT_SECRET;

// יצירת טוקן
export function generateToken(user: IUser) {
  if (!JWTSECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.sign(
    { id: user._id, email: user.email },
    JWTSECRET,
    { expiresIn: '1h' }
  );
}

// שליחת טוקן כ-cookie
export function sendTokenAsCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'production' ? true : process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV !== 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60,
  });
}

// אימות טוקן
export function verifyToken(token: string): JwtPayload {
  if (!JWTSECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.verify(token, JWTSECRET) as JwtPayload;
}

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Missing authentication token' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};