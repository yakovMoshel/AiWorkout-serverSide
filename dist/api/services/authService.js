"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserFromToken = getUserFromToken;
const auth_1 = require("../../middleware/auth");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function registerUser(email, password, name) {
    const existingUser = await user_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = new user_1.default({ email, password: hashedPassword, name });
    await user.save();
    const token = (0, auth_1.generateToken)(user);
    return { user, token };
}
async function loginUser(email, password) {
    const user = await user_1.default.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const token = (0, auth_1.generateToken)(user);
    return { user, token };
}
async function getUserFromToken(token) {
    const decoded = (0, auth_1.verifyToken)(token);
    const user = await user_1.default.findById(decoded.id);
    if (!user)
        return null;
    if (user.image) {
        user.image = `${process.env.SERVER_URL}${user.image}`;
    }
    return {
        name: user.name,
        age: user.age,
        goal: user.goal,
        height: user.height,
        weight: user.weight,
        image: user.image
    };
}
