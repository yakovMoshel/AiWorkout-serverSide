"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setupController_1 = require("../api/controller/setupController");
const auth_1 = require("../middleware/auth");
const workoutController_1 = require("../api/controller/workoutController");
const router = express_1.default.Router();
router.post('/workout', auth_1.authenticate, setupController_1.handleSetupAndPlan);
router.get('/workout', auth_1.authenticate, workoutController_1.getWorkoutPlan);
exports.default = router;
