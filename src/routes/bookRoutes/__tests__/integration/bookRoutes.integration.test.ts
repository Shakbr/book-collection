import { HttpStatus } from './../../../../utils/httpStatusCodesUtils';
import { Book } from '../../../../models/Book';
import { bookData, userData } from './../../../../testUtils/testData';
import request from 'supertest';
import app from '../../../../app';
import sequelize from '../../../../database/config/sequelize';
import requestWithAuth from '../../../../testUtils/requestHook';

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
      expect(createUserResponse.status).toBe(HttpStatus.CREATED);
      expect(createUserResponse.body).toHaveProperty('id');
    });
  });

  describe('GET /books', () => {
    it('should get all books', async () => {
      const response = await requestWithAuth.get('/books', token);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(Array.isArray(response.body.books)).toBe(true);
    });
  });

  describe('GET /books/:id', () => {
    it('should get a book by id', async () => {
      const response = await requestWithAuth.get(`/books/${createUserResponse.body.id}`, token);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book by id', async () => {
      const updatedBookTitle = 'Updated Book Title';
      const response = await requestWithAuth
        .put(`/books/${createUserResponse.body.id}`, token)
        .send({ ...bookData, title: updatedBookTitle, lastReadPage: 1 });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(updatedBookTitle);
    });
  });

  it('throws an error if lastReadPage is less than 1 or greater than total pages', async () => {
    const updatedBookData = { ...bookData, lastReadPage: 0 };
    const response = await requestWithAuth.put(`/books/${createUserResponse.body.id}`, token).send(updatedBookData);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book by id', async () => {
      const response = await requestWithAuth.delete(`/books/${createUserResponse.body.id}`, token);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });
});
