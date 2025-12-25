"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetupAndPlan = handleSetupAndPlan;
const setupService_1 = require("../services/setupService");
async function handleSetupAndPlan(req, res) {
    const userId = req.user.id;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const updatedUser = await (0, setupService_1.generateWorkoutPlan)(userId, req.body);
        res.status(200).json({
            message: 'Profile saved and workout plan created',
            workoutPlan: updatedUser.workoutPlan,
        });
    }
    catch (err) {
        console.error("AXIOS ERROR:", err.response?.data || err.message);
        res.status(500).json({ message: 'Failed to save data or generate workout plan' });
    }
}
