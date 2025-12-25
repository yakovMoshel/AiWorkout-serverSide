"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const vitest_1 = require("vitest");
let mongo;
(0, vitest_1.beforeAll)(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose_1.default.connect(uri);
});
(0, vitest_1.afterEach)(async () => {
    const db = mongoose_1.default.connection.db;
    const collections = db ? await db.collections() : [];
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});
(0, vitest_1.afterAll)(async () => {
    await mongoose_1.default.connection.close();
    await mongo.stop();
});
