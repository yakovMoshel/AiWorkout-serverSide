import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../api/types/user';
import { JwtPayload } from '../api/types/JwtPayload';

const JWT_SECRET = process.env.JWT_SECRET || 'abctesttoken'; // Use an environment variable in production

// יצירת טוקן
export function generateToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// אימות טוקן
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

// Middleware לאימות משתמש
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  try {
    const decoded = verifyToken(token);
    // אפשר להרחיב את טיפוס ה־Request כדי לכלול user
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}