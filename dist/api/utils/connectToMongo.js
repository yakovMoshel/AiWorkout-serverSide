"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = async () => {
    if (!process.env.MONGO_URI)
        throw new Error('MONGO_URI not set');
    await mongoose_1.default.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
};
exports.connectToMongoDB = connectToMongoDB;
