"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const User_1 = __importDefault(require("../api/models/User"));
const server_1 = require("../server");
const testUser = {
    email: 'testuser@example.com',
    password: 'Test12345',
    confirmPassword: 'Test12345',
    name: 'Test User',
};
let token = '';
(0, vitest_1.describe)('Auth Flow with Validation', () => {
    (0, vitest_1.beforeEach)(async () => {
        await User_1.default.deleteMany({});
    });
    (0, vitest_1.it)('should register a new user', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/auth/register')
            .send(testUser);
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.user.email).toBe(testUser.email);
        (0, vitest_1.expect)(res.body).toHaveProperty('message');
    });
    (0, vitest_1.it)('should not register with duplicate email', async () => {
        await (0, supertest_1.default)(server_1.app).post('/auth/register').send(testUser);
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/auth/register')
            .send(testUser);
        (0, vitest_1.expect)(res.status).toBe(422);
        (0, vitest_1.expect)(res.body.errors[0].msg).toBe('E-Mail exists already, please pick a different one.');
    });
    (0, vitest_1.it)('should not register with missing fields', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/auth/register')
            .send({ email: '', password: '', confirmPassword: '', name: '' });
        (0, vitest_1.expect)(res.status).toBe(422);
        (0, vitest_1.expect)(res.body).toHaveProperty('errors');
    });
    (0, vitest_1.it)('should login with correct credentials', async () => {
        await (0, supertest_1.default)(server_1.app).post('/auth/register').send(testUser);
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.user.email).toBe(testUser.email);
        (0, vitest_1.expect)(res.body).toHaveProperty('message');
        // שמירת ה-token (Cookie)
        token =
            res.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1] || '';
    });
    (0, vitest_1.it)('should not login with wrong password', async () => {
        await (0, supertest_1.default)(server_1.app).post('/auth/register').send(testUser);
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/auth/login')
            .send({ email: testUser.email, password: 'WrongPass123' });
        (0, vitest_1.expect)(res.status).toBe(401);
        (0, vitest_1.expect)(res.body).toHaveProperty('message', 'Invalid credentials');
    });
    (0, vitest_1.it)('should not login with non-existent email', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/auth/login')
            .send({ email: 'notfound@example.com', password: 'Test12345' });
        (0, vitest_1.expect)(res.status).toBe(422);
        (0, vitest_1.expect)(res.body.errors[0].msg).toBe('E-Mail not found.');
    });
    (0, vitest_1.it)('should get authenticated user with valid token', async () => {
        await (0, supertest_1.default)(server_1.app).post('/auth/register').send(testUser);
        const loginRes = await (0, supertest_1.default)(server_1.app)
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        const cookie = loginRes.headers['set-cookie'][0];
        const res = await (0, supertest_1.default)(server_1.app)
            .get('/auth/user')
            .set('Cookie', cookie);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.user.email).toBe(testUser.email);
    });
    (0, vitest_1.it)('should not get authenticated user without token', async () => {
        const res = await (0, supertest_1.default)(server_1.app).get('/auth/user');
        (0, vitest_1.expect)(res.status).toBe(401);
        (0, vitest_1.expect)(res.body).toHaveProperty('message');
    });
});
