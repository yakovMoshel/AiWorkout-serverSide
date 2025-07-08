import { generateToken } from '../../middleware/auth';
import User from '../models/user';
import { IUser } from '../types/user';
import bcrypt from 'bcryptjs';

export async function registerUser(email: string, password: string, name: string): Promise<IUser> {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, name });
  await user.save();
  return user;
}


export async function loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
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