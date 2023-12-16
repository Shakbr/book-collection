import { HttpStatus } from '../../utils/httpStatusCodesUtils';
import { ApiError } from '../ApiError';

describe('ApiError', () => {
  const testCases = [
    { method: 'badRequest', status: HttpStatus.BAD_REQUEST, message: 'Bad request error' },
    { method: 'notFound', status: HttpStatus.NOT_FOUND, message: 'Not found error' },
    { method: 'unauthorized', status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized error' },
    { method: 'forbidden', status: HttpStatus.FORBIDDEN, message: 'Forbidden error' },
    { method: 'conflict', status: HttpStatus.CONFLICT, message: 'Conflict error' },
  ];

  testCases.forEach(({ method, status, message }) => {
    it(`should create a ${method} error`, () => {
      const error = ApiError[method](message);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(status);
      expect(error.message).toBe(message);
    });
  });
});
