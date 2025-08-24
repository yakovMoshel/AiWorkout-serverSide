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
const JWTSECRET = process.env.JWT_SECRET;
// יצירת טוקן
function generateToken(user) {
    if (!JWTSECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWTSECRET, { expiresIn: '1h' });
}
// שליחת טוקן כ-cookie
function sendTokenAsCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60,
    });
}
// אימות טוקן
function verifyToken(token) {
    if (!JWTSECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return jsonwebtoken_1.default.verify(token, JWTSECRET);
}
const authenticate = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: 'Missing authentication token' });
        return; // לא מחזיר response - רק עוצר כאן
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
