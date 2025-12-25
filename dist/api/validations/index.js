"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.signupValidation = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("./../models/User"));
exports.signupValidation = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom(async (value) => {
        const userDoc = await User_1.default.findOne({ email: value });
        if (userDoc) {
            return Promise.reject("E-Mail exists already, please pick a different one.");
        }
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long."),
    (0, express_validator_1.body)("confirmPassword")
        .trim()
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match.");
        }
        return true;
    }),
    (0, express_validator_1.body)("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter a name."),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom(async (value) => {
        const userDoc = await User_1.default.findOne({ email: value });
        if (!userDoc) {
            return Promise.reject("E-Mail not found.");
        }
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long."),
];
