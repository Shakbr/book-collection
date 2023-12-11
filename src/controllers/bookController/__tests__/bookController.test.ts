import { BookData } from './../../../types/types';
import request from 'supertest';
import app from '../../../app';
import sequelize from '../../../database/config/sequelize';
import { userData } from '../../userController/__tests__/userController.test';
import requestWithAuth from '../../../testUtils/requestHook';
import { Book } from '../../../models/Book';

const bookData: BookData = {
  title: 'Test Book',
  content: ['Page 1', 'Page 2'],
  lastReadPage: 1,
  author: 'Test Author',
};

let token: string;
let createUserResponse: request.Response;
describe('Book Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app).post('/api/users/register').send(userData);

    const loginResponse = await request(app).post('/api/users/login').send(userData);

    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await Book.destroy({ truncate: true });
    createUserResponse = await requestWithAuth.post('/books', token, bookData);
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      expect(createUserResponse.status).toBe(201);
      expect(createUserResponse.body).toHaveProperty('id');
    });
  });

  describe('GET /books', () => {
    it('should get all books', async () => {
      const response = await requestWithAuth.get('/books', token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(Array.isArray(response.body.books)).toBe(true);
    });
  });

  describe('GET /books/:id', () => {
    it('should get a book by id', async () => {
      const response = await requestWithAuth.get(`/books/${createUserResponse.body.id}`, token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book by id', async () => {
      const updatedBookTitle = 'Updated Book Title';
      const response = await requestWithAuth
        .put(`/books/${createUserResponse.body.id}`, token)
        .send({ ...bookData, title: updatedBookTitle });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(updatedBookTitle);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book by id', async () => {
      const response = await requestWithAuth.delete(`/books/${createUserResponse.body.id}`, token);

      expect(response.status).toBe(204);
    });
  });
});
