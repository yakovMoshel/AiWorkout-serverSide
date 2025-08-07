"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutPlan = getWorkoutPlan;
const workoutServices_1 = require("../services/workoutServices");
async function getWorkoutPlan(req, res) {
    const userId = req.user?.id;
    try {
        const workoutPlan = await (0, workoutServices_1.fetchUserWorkoutPlan)(userId);
        res.status(200).json({ workoutPlan });
    }
    catch (err) {
        console.error('Error fetching workout plan:', err.message);
        res.status(404).json({ message: err.message || 'Workout plan not found' });
    }
}
