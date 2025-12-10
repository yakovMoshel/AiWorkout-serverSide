import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../api/models/User';
import { app } from '../server';

const testUser = {
  email: 'testuser@example.com',
  password: 'Test12345',
  confirmPassword: 'Test12345',
  name: 'Test User'
};

let token = '';

describe('Auth Flow with Validation', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('message');
  });

  it('should not register with duplicate email', async () => {
    await request(app).post('/auth/register').send(testUser);

    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.status).toBe(422); // בהתאם ל-validation שלך
    expect(res.body.errors[0].msg).toBe(
      'E-Mail exists already, please pick a different one.'
    );
  });

  it('should not register with missing fields', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: '', password: '', confirmPassword: '', name: '' });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('should login with correct credentials', async () => {
    await request(app).post('/auth/register').send(testUser);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('message');

    // Save token for authenticated requests
    token = res.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1] || '';
  });

it('should not login with wrong password', async () => {
  await request(app).post('/auth/register').send(testUser);

  const res = await request(app)
    .post('/auth/login')
    .send({ email: testUser.email, password: 'WrongPass123' });

  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty('message', 'Invalid credentials');
});


  it('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'notfound@example.com', password: 'Test12345' });

    expect(res.status).toBe(422); // בהתאם ל-loginValidation
    expect(res.body.errors[0].msg).toBe('E-Mail not found.');
  });

  it('should get authenticated user with valid token', async () => {
    await request(app).post('/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookie = loginRes.headers['set-cookie'][0];

    const res = await request(app)
      .get('/auth/user')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should not get authenticated user without token', async () => {
    const res = await request(app).get('/auth/user');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
