"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = void 0;
exports.register = register;
exports.login = login;
exports.logout = logout;
const authService_1 = require("../services/authService");
const auth_1 = require("../../middleware/auth");
async function register(req, res) {
    const { email, password, name } = req.body;
    try {
        const { user, token } = await (0, authService_1.registerUser)(email, password, name);
        (0, auth_1.sendTokenAsCookie)(res, token);
        res.status(201).json({
            message: 'User registered successfully',
            user: { email: user.email, name: user.name },
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const { user, token } = await (0, authService_1.loginUser)(email, password);
        (0, auth_1.sendTokenAsCookie)(res, token);
        res.json({
            message: 'Login successful',
            user: { email: user.email, name: user.name },
        });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
}
async function logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
}
const getAuthenticatedUser = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ message: 'No token found' });
            return;
        }
        const user = await (0, authService_1.getUserFromToken)(token);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.getAuthenticatedUser = getAuthenticatedUser;
