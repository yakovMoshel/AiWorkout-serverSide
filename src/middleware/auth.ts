import jwt from 'jsonwebtoken';
import { Response, RequestHandler } from 'express';
import { IUser } from '../api/types/user';
import { JwtPayload } from '../api/types/JwtPayload';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return secret;
}

// יצירת טוקן
export function generateToken(user: IUser) {

  return jwt.sign(
    { id: user._id, email: user.email },
    getJwtSecret(),
    { expiresIn: '1h' }
  );
}

// שליחת טוקן כ-cookie
export function sendTokenAsCookie(res: Response, token: string) {
  // const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60,
  });
}


// אימות טוקן
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
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