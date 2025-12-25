"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromMongoDB = exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = async () => {
    const uri = process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_test
        : process.env.MONGO_URI;
    if (!uri) {
        throw new Error("❌ Mongo URI not set");
    }
    if (mongoose_1.default.connection.readyState === 0) {
        await mongoose_1.default.connect(uri);
        console.log("✅ Connected to MongoDB");
    }
};
exports.connectToMongoDB = connectToMongoDB;
const disconnectFromMongoDB = async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
};
exports.disconnectFromMongoDB = disconnectFromMongoDB;
