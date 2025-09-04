"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = exports.logout = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const auth_1 = require("../../middleware/auth");
const express_validator_1 = require("express-validator");
const register = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const { email, password, name } = req.body;
        const { user, token } = await (0, authService_1.registerUser)(email, password, name);
        (0, auth_1.sendTokenAsCookie)(res, token);
        res.status(201).json({
            message: 'User registered successfully',
            user: { email: user.email, name: user.name },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const { email, password } = req.body;
        const { user, token } = await (0, authService_1.loginUser)(email, password);
        (0, auth_1.sendTokenAsCookie)(res, token);
        res.json({
            message: 'Login successful',
            user: { email: user.email, name: user.name },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getAuthenticatedUser = async (req, res, next) => {
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
        next(err);
    }
};
exports.getAuthenticatedUser = getAuthenticatedUser;
