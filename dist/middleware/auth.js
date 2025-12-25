"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
exports.generateToken = generateToken;
exports.sendTokenAsCookie = sendTokenAsCookie;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }
    return secret;
}
// יצירת טוקן
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, getJwtSecret(), { expiresIn: '1h' });
}
// שליחת טוקן כ-cookie
function sendTokenAsCookie(res, token) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60,
    });
}
// אימות טוקן
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, getJwtSecret());
}
const authenticate = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: 'Missing authentication token' });
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
