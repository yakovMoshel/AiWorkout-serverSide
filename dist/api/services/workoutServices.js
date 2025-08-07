"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserWorkoutPlan = fetchUserWorkoutPlan;
const user_1 = __importDefault(require("../models/user"));
async function fetchUserWorkoutPlan(userId) {
    const user = await user_1.default.findById(userId);
    if (!user || !user.workoutPlan) {
        throw new Error("Workout plan not found");
    }
    return user.workoutPlan;
}
