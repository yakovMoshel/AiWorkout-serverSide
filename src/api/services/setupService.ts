import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import User from '../models/User';
import { IUser } from '../types/user';
import Exercise from '../models/Exercise';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(options: object, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await axios.request(options);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = (err?.message || '') + (err?.response?.data?.message || '');
      const isRateLimit = status === 429 || msg.toLowerCase().includes('rate limit');

      if (!isRateLimit || attempt === maxRetries) {
        if (isRateLimit) {
          throw new Error('Service is temporarily busy due to high demand. Please try again in a few minutes.');
        }
        throw err;
      }

      console.log(`RapidAPI rate limit hit (attempt ${attempt}/${maxRetries}). Retrying in 65 seconds...`);
      await sleep(65_000);
    }
  }
}

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

  const response = await callWithRetry(options);
  const workoutPlan = response.data;

  const days = workoutPlan?.result?.exercises ?? workoutPlan?.exercises;

  if (days) {
    const allExercises = await Exercise.find({});

    const normalize = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

    const words = (s: string) => new Set(normalize(s).split(' ').filter(w => w.length > 1));

    const findMatch = (apiName: string) => {
      const normApi = normalize(apiName);
      const apiWords = words(apiName);

      // 1. exact (case-insensitive)
      const exact = allExercises.find(e => normalize(e.name) === normApi);
      if (exact) return exact;

      // 2. DB name is a substring of the API name
      const dbInApi = allExercises.find(e => normApi.includes(normalize(e.name)));
      if (dbInApi) return dbInApi;

      // 3. API name is a substring of DB name
      const apiInDb = allExercises.find(e => normalize(e.name).includes(normApi));
      if (apiInDb) return apiInDb;

      // 4. all DB words appear in API name (e.g. "Sit Ups" ↔ "Abdominal Sit Ups")
      const dbAllInApi = allExercises.find(e => {
        const dbWords = words(e.name);
        return dbWords.size > 0 && [...dbWords].every(w => apiWords.has(w));
      });
      if (dbAllInApi) return dbAllInApi;

      // 5. all API words appear in DB name
      const apiAllInDb = allExercises.find(e => {
        const dbWords = words(e.name);
        return apiWords.size > 0 && [...apiWords].every(w => dbWords.has(w));
      });
      if (apiAllInDb) return apiAllInDb;

      // 6. best word overlap (≥ 60% of the larger set must match)
      let bestMatch: typeof allExercises[0] | null = null;
      let bestScore = 0;
      for (const e of allExercises) {
        const dbWords = words(e.name);
        const common = [...apiWords].filter(w => dbWords.has(w)).length;
        const score = common / Math.max(apiWords.size, dbWords.size);
        if (score > bestScore) { bestScore = score; bestMatch = e; }
      }
      return bestScore >= 0.6 ? bestMatch : null;
    };

    for (const day of days) {
      for (const exercise of day.exercises) {
        const found = findMatch(exercise.name);
        if (!found) continue;

        if (!found.imageBase64) {
          const imagePath = path.join(process.cwd(), found.image);
          if (fs.existsSync(imagePath)) {
            const buffer = await sharp(imagePath)
              .resize(400, 400, { fit: 'cover' })
              .jpeg({ quality: 75 })
              .toBuffer();
            found.imageBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
            await found.save();
          }
        }

        if (found.imageBase64) {
          exercise.image = found.imageBase64;
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