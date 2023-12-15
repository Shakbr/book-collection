import { AuthRequest } from './../../../types/types';
import { findBookOrThrow } from './../../../helpers/bookHelpers';
import { ApiError } from './../../../errors/ApiError';
import { HttpStatus } from '../../../utils/httpStatusCodesUtils';
import { Request, Response, NextFunction } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { BookController } from '..';
import { Book } from '../../../models/Book';
import { bookData, userDTO } from '../../../testUtils/testData';
import { isAdmin } from '../../../utils/authUtils';
import { Role } from '../../../models/User';

jest.mock('../../../models/Book');
jest.mock('../../../helpers/bookHelpers');

let req: MockProxy<Request> & AuthRequest;
let res: MockProxy<Response> & Response;
let next: jest.MockedFunction<NextFunction>;
let bookController: BookController;
let nextError: Error | null;

jest.mock('../../../models/Book');

jest.mock('../../../utils/authUtils', () => ({
  isAdmin: jest.fn(),
}));

beforeEach(() => {
  req = mock<Request>();
  res = mock<Response>({
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  });
  next = jest.fn().mockImplementation((error) => {
    nextError = error;
  });
  bookController = new BookController();
  nextError = null;
  req.params.id = '1';
  req.body = bookData;
});

describe('BookController', () => {
  describe('create', () => {
    it('should create a book', async () => {
      req.user = userDTO;
      (Book.create as jest.Mock).mockResolvedValueOnce(bookData);

      await bookController.create(req, res, next);
      expect(Book.create).toHaveBeenCalledWith({ ...req.body, userId: req.user.id, lastReadPage: 0 });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(bookData);
    });
  });
  describe('findOne', () => {
    it('should find a book', async () => {
      const mockBook = mock<Book>();
      (findBookOrThrow as jest.Mock).mockResolvedValueOnce(mockBook);

      await bookController.findOne(req, res, next);

      expect(findBookOrThrow).toHaveBeenCalledWith(req.params.id, req.user);
      expect(res.json).toHaveBeenCalledWith(mockBook);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('findAll', () => {
    const regularUserId = 2;
    const testCases = [
      { isAdmin: true, where: {} },
      { isAdmin: false, where: { userId: regularUserId } },
    ];

    testCases.forEach(({ isAdmin: isAdminCase, where }) => {
      it(`should find all books for ${isAdminCase ? Role.ADMIN : Role.REGULAR} user`, async () => {
        req.user = userDTO;
        if (!isAdminCase) req.user.id = regularUserId;

        const mockBooks = isAdminCase
          ? Array(4).fill(mock<Book>({}))
          : [
              ...Array(2).fill(mock<Book>({ ...bookData, userId: regularUserId })),
              ...Array(2).fill(mock<Book>({ ...bookData, userId: regularUserId + 1 })),
            ];
        console.log(mockBooks);
        (Book.findAndCountAll as jest.Mock).mockResolvedValueOnce({
          count: mockBooks.length,
          rows: mockBooks,
        });
        (isAdmin as jest.Mock).mockReturnValueOnce(isAdminCase);

        req.query = { limit: '10', page: '1' };

        await bookController.findAll(req, res, next);

        expect(isAdmin).toHaveBeenCalledWith(req.user);
        expect(Book.findAndCountAll).toHaveBeenCalledWith({
          where,
          limit: 10,
          offset: 0,
          order: [['createdAt', 'ASC']],
        });

        expect(res.json).toHaveBeenCalledWith({
          books: isAdminCase ? mockBooks : mockBooks.slice(0, 5),
          totalItems: mockBooks.length,
          totalPages: 1,
          currentPage: 1,
        });
      });
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      req.body = { ...req.body, lastReadPage: 3 };
      const mockBook = mock<Book>({
        content: Array(5).fill('content'),
        update: jest.fn().mockResolvedValueOnce(bookData),
      });
      (findBookOrThrow as jest.Mock).mockResolvedValueOnce(mockBook);

      await bookController.update(req, res, next);

      expect(findBookOrThrow).toHaveBeenCalledWith(req.params.id, req.user);
      expect(mockBook.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(bookData);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw an error if lastReadPage is greater than total page', async () => {
      const contentLength = 5;
      req.body = { ...req.body, lastReadPage: contentLength + 1 };
      const mockBook = mock<Book>({
        ...bookData,
        content: Array(contentLength).fill('content'),
      });
      (findBookOrThrow as jest.Mock).mockResolvedValueOnce(mockBook);

      await bookController.update(req, res, next);

      expect(findBookOrThrow).toHaveBeenCalledWith(req.params.id, req.user);
      expect(nextError).toBeDefined();
      expect(nextError).toBeInstanceOf(ApiError);
      expect(nextError!.message).toEqual(
        `Invalid last read page number, must be between 1 and total number of pages ${contentLength}}`,
      );
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const mockBook = mock<Book>({
        destroy: jest.fn().mockResolvedValueOnce(undefined),
      });
      (findBookOrThrow as jest.Mock).mockResolvedValueOnce(mockBook);

      await bookController.delete(req, res, next);

      expect(findBookOrThrow).toHaveBeenCalledWith(req.params.id, req.user);
      expect(mockBook.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  // Add more tests for other methods of BookController here
});
