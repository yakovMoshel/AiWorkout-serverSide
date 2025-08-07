"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWorkoutPlan = generateWorkoutPlan;
const axios_1 = __importDefault(require("axios"));
const user_1 = __importDefault(require("../models/user"));
async function generateWorkoutPlan(userId, formData) {
    const { gender, age, height, weight, goal, experience, trainingDays, healthNotes, preferences = ['Weight training'], sessionDuration = 60, planDurationWeeks = 8, } = formData;
    // עדכון פרטי המשתמש
    const user = await user_1.default.findByIdAndUpdate(userId, {
        gender,
        age,
        height,
        weight,
        goal,
        experience,
        trainingDays,
        healthNotes,
        preferences,
        sessionDuration,
        planDurationWeeks,
    }, { new: true });
    if (!user)
        throw new Error("User not found");
    // קריאה ל-API החיצוני לפי הדוקומנטציה
    const options = {
        method: 'POST',
        url: 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan',
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
    const response = await axios_1.default.request(options);
    const workoutPlan = response.data;
    // שמירה במסד הנתונים
    user.workoutPlan = workoutPlan;
    await user.save();
    return user;
}
// export async function getWorkoutPlanStatus(userId: string) {
//   const user = await User.findById(userId);
//   if (!user || !user.workoutPlan?.queueId) {
//     throw new Error('No workout plan in progress');
//   }
//   const queueId = user.workoutPlan.queueId;
//   const response = await axios.get(
//     `https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/checkWorkoutStatus?queueId=${queueId}`,
//     {
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPID_API_KEY || '',
//         'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
//       },
//     }
//   );
//   const planData = response.data;
//   if (planData.status === 'completed') {
//     user.workoutPlan = planData; // שמירה של התוכנית המלאה
//     await user.save();
//   }
//   return planData;
// }
