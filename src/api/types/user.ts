import mongoose from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  experience?: string;
  trainingDays?: string[];
  healthNotes?: string;
  workoutPlan?: any;
  preferences?: string[];
  sessionDuration?: number;
  planDurationWeeks?: number;
  image?: string;
}
