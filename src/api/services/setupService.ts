import axios from 'axios';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import { IUser } from '../types/user';
import Exercise from '../models/Exercise';

interface SetupFormInput {
  gender: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  experience: string;
  trainingDays: string[];
  healthNotes: string;
  preferences?: string[];
  sessionDuration?: number;
  planDurationWeeks?: number;
}

export async function generateWorkoutPlan(
  userId: string,
  formData: SetupFormInput
): Promise<IUser> {
  const {
    gender,
    age,
    height,
    weight,
    goal,
    experience,
    trainingDays,
    healthNotes,
    preferences = ['Weight training'],
    sessionDuration = 60,
    planDurationWeeks = 8,
  } = formData;

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const options = {
    method: 'POST',
    url: 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan', // ← חזר
    params: { noqueue: '1' },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY || '',
      'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      goal,
      fitness_level: experience,
      preferences,
      health_conditions: healthNotes ? [healthNotes] : ['None'],
      schedule: {
        days_per_week: trainingDays.length,
        session_duration: sessionDuration,
      },
      plan_duration_weeks: planDurationWeeks,
      lang: 'en',
    },
  };

  const response = await axios.request(options);
  const workoutPlan = response.data;

  const days = workoutPlan?.result?.exercises ?? workoutPlan?.exercises;

  if (days) {
    for (const day of days) {
      for (const exercise of day.exercises) {
        const found = await Exercise.findOne({
          name: { $regex: new RegExp(`^${exercise.name}$`, 'i') }
        });
        if (found) {
          const imagePath = path.join(process.cwd(), found.image);
          if (fs.existsSync(imagePath)) {
            const ext = path.extname(found.image).replace('.', '');
            const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
            const base64 = fs.readFileSync(imagePath).toString('base64');
            exercise.image = `data:${mimeType};base64,${base64}`;
          }
        }
      }
    }
  }

  user.gender = gender;
  user.age = age;
  user.height = height;
  user.weight = weight;
  user.goal = goal;
  user.experience = experience;
  user.trainingDays = trainingDays;
  user.healthNotes = healthNotes;
  user.preferences = preferences;
  user.sessionDuration = sessionDuration;
  user.planDurationWeeks = planDurationWeeks;
  user.workoutPlan = workoutPlan;
  await user.save();

  return user;
}