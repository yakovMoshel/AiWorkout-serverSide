import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IUser } from '../api/types/user';
import { JwtPayload } from '../api/types/JwtPayload';

const JWT_SECRET = process.env.JWT_SECRET || 'abctesttoken';

// יצירת טוקן
export function generateToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// שליחת טוקן כ-cookie
export function sendTokenAsCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60,
  });
}

// אימות טוקן
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Missing authentication token' });
    return; // לא מחזיר response - רק עוצר כאן
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};