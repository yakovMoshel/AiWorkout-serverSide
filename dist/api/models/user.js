"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    goal: { type: String },
    experience: { type: String },
    trainingDays: [{ type: String }],
    healthNotes: { type: String },
    workoutPlan: { type: mongoose_1.default.Schema.Types.Mixed }
});
exports.default = mongoose_1.default.model('User', userSchema);
