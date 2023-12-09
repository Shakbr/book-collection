import request from 'supertest';
import app from '../../../app';
import sequelize from '../../../database/config/sequelize';

export const userData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};
describe('UserController', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  describe('POST /users/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/users/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/users/register').send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ ...userData, email: 'notvalid' });

      expect(response.status).toBe(400);
    });

    it('should return 409 if password is not strong enough', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ ...userData, password: 'short' });

      expect(response.status).toBe(409);
    });

    it('should return 409 if email is already in use', async () => {
      await request(app).post('/api/users/register').send(userData);
      const response = await request(app).post('/api/users/register').send(userData);

      expect(response.status).toBe(409);
    });
  });

  describe('POST /users/login', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/users/login').send({});

      expect(response.status).toBe(400);
    });

    it('should return 401 if email is not registered', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'notregistered@test.com', password: 'password' });

      expect(response.status).toBe(401);
    });

    it('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: userData.email, password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    it('should return 200 and a token if email and password are correct', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: userData.email, password: userData.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
