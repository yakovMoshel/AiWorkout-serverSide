import { generateToken, verifyToken } from '../../middleware/auth';
import User from '../models/user';
import { JwtPayload } from '../types/JwtPayload';
import { IUser } from '../types/user';
import bcrypt from 'bcryptjs';

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ user: IUser; token: string }> {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, name });
  await user.save();

  const token = generateToken(user);
  return { user, token };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  return { user, token };
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token) as JwtPayload;
  const user = await User.findById(decoded.id);
  if (!user) return null;
  return {
    name: user.name,
    age: user.age,
    goal: user.goal,
    height: user.height,
    weight: user.weight
  };
}




