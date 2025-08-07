"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../api/controller/authController");
const validations_1 = require("../api/validations");
const router = express_1.default.Router();
router.post('/register', validations_1.signupValidation, authController_1.register);
router.post('/login', validations_1.loginValidation, authController_1.login);
router.post('/logout', authController_1.logout);
router.get('/user', authController_1.getAuthenticatedUser);
exports.default = router;
