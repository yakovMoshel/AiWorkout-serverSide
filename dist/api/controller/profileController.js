"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = updateProfile;
const User_1 = __importDefault(require("../models/User"));
async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const file = req.file;
        const imageUrl = file ? `/uploads/${file.filename}` : undefined;
        const { name, weight, goal } = req.body;
        const update = {};
        if (name)
            update.name = name;
        if (weight)
            update.weight = weight;
        if (goal)
            update.goal = goal;
        if (imageUrl)
            update.image = imageUrl;
        const user = await User_1.default.findByIdAndUpdate(userId, update, { new: true });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (user.image) {
            user.image = `${process.env.SERVER_URL}${user.image}`;
        }
        res.status(200).json({ message: 'Profile updated', user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
