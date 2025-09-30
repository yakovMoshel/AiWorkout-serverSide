import { generateToken, verifyToken } from '../../middleware/auth';
import User from "./../models/User";
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
    const error: any = new Error("Email already exists");
    error.status = 400;
    throw error;
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
    const error: any = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error: any = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user, token };
}


export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token) as JwtPayload;
  const user = await User.findById(decoded.id);

  if (!user) return null;

  if (user.image) {
    user.image = `${process.env.SERVER_URL}${user.image}`;
  }
  return {
    name: user.name,
    email: user.email,
    age: user.age,
    goal: user.goal,
    height: user.height,
    weight: user.weight,
    image: user.image
  };
}




