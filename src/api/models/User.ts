import mongoose from "mongoose";
import { IUser } from "../types/user";

const userSchema = new mongoose.Schema<IUser>({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  gender: { type: String },
  age: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  goal: { type: String },
  image: { type: String },
  experience: { type: String },
  trainingDays: [{ type: String }],
  healthNotes: { type: String },
  preferences: [{ type: String }],
  sessionDuration: { type: Number },
  planDurationWeeks: { type: Number },
  workoutPlan: { type: mongoose.Schema.Types.Mixed }
});


export default mongoose.model<IUser>('User', userSchema);