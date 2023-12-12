import request from 'supertest';
import app from '../../../../app';
import { userDTO, userData } from '../../../../testUtils/testData';
import sequelize from '../../../../database/config/sequelize';
import { HttpStatus } from '../../../../utils/httpStatusCodesUtils';

describe('userRoutes integration tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  describe('POST /api/users/register', () => {
    describe('User Registration', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app).post('/api/users/register').send(userData);
      });
      afterEach(async () => {
        await sequelize.sync({ force: true });
      });
      it('should register a new user', async () => {
        await request(app).post('/api/users/register').send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(userDTO);
      });

      it('should return error if email is already in use', async () => {
        const sameUserRegistration = await request(app).post('/api/users/register').send(userData);

        expect(sameUserRegistration.status).toBe(409);
        expect(sameUserRegistration.body).toEqual({ error: 'Email already in use' });
      });
    });
    describe('Validation', () => {
      const testCases = [
        { field: 'email', value: 'invalidEmail', description: 'email is not valid' },
        { field: 'password', value: '123', description: 'password is not valid' },
        { field: 'name', value: '', description: 'name is not valid' },
        { field: 'role', value: 'invalidRole', description: 'role is not valid' },
      ];
      runValidationTests(testCases);
    });
  });
  describe('POST /api/users/login', () => {
    describe('User Login', () => {
      afterEach(async () => {
        await sequelize.sync({ force: true });
      });
      it('should login a user', async () => {
        await request(app).post('/api/users/register').send(userData);
        const response = await request(app).post('/api/users/login').send(userData);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveProperty('token');
      });

      it('should return error if email is not registered', async () => {
        const sameUserRegistration = await request(app)
          .post('/api/users/login')
          .send({ ...userData, email: 'notRegisteredEmail' });

        expect(sameUserRegistration.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(sameUserRegistration.body).toEqual({ error: 'Invalid credentials' });
      });
    });
    describe('Validation', () => {
      const testCases = [
        { field: 'email', value: 'invalidEmail', description: 'email is not valid' },
        { field: 'password', value: '123', description: 'password is not valid' },
      ];
      runValidationTests(testCases);
    });
  });
});

function runValidationTests(testCases: Array<{ field: string; value: string; description: string }>) {
  testCases.forEach(({ field, value, description }) => {
    it(`should return a ${HttpStatus.BAD_REQUEST} status if ${description}`, async () => {
      const invalidData = { ...userData, [field]: value };
      const response = await request(app).post('/api/users/register').send(invalidData);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
}
