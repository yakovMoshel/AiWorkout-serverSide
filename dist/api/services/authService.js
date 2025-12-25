"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserFromToken = getUserFromToken;
const auth_1 = require("../../middleware/auth");
const User_1 = __importDefault(require("./../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function registerUser(email, password, name) {
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        const error = new Error("Email already exists");
        error.status = 400;
        throw error;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = new User_1.default({ email, password: hashedPassword, name });
    await user.save();
    const token = (0, auth_1.generateToken)(user);
    return { user, token };
}
async function loginUser(email, password) {
    const user = await User_1.default.findOne({ email });
    if (!user) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    const token = (0, auth_1.generateToken)(user);
    return { user, token };
}
async function getUserFromToken(token) {
    const decoded = (0, auth_1.verifyToken)(token);
    const user = await User_1.default.findById(decoded.id);
    if (!user)
        return null;
    if (user.image) {
        user.image = `${process.env.SERVER_URL}${user.image}`;
    }
    return {
        name: user.name,
        email: user.email,
        age: user.age,
        goal: user.goal,
        height: user.height,
        weight: user.weight,
        image: user.image
    };
}
