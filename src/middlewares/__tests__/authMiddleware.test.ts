import { protect, JWT_SECRET_KEY } from '../authMiddleware';
import { mock, MockProxy } from 'jest-mock-extended';
import { Response, NextFunction } from 'express';
import { ApiError } from '../../errors/ApiError';
import { AuthRequest, UserDTO } from '../../types/types';
import jwt from 'jsonwebtoken';

describe('protect', () => {
  let req: MockProxy<AuthRequest> & AuthRequest;
  let res: MockProxy<Response> & Response;
  let next: MockProxy<NextFunction> & NextFunction;
  let nextError: Error | null;

  beforeEach(() => {
    req = mock<AuthRequest>();
    res = mock<Response>();
    next = jest.fn().mockImplementation((error) => {
      nextError = error;
    });
    nextError = null;
  });

  it('should throw a bad request error if no token is provided', async () => {
    req.header.mockReturnValue(undefined);

    await protect(req, res, next);
    expect(nextError).toBeDefined();
    expect(nextError).toBeInstanceOf(ApiError);
    expect(nextError!.message).toEqual('No token provided');
  });

  it('should throw an unauthorized error if the token is invalid', async () => {
    req.header.mockReturnValue('Bearer invalid_token');

    await protect(req, res, next);
    expect(nextError).toBeDefined();
    expect(nextError).toBeInstanceOf(ApiError);
    expect(nextError!.message).toEqual('Not authorized');
  });

  it('should set req.user and call next if the token is valid', async () => {
    const user: UserDTO = { id: 1, name: 'Test', email: 'test@test.com', role: 'user' };
    req.header.mockReturnValue(`Bearer ${jwt.sign({ user }, JWT_SECRET_KEY)}`);

    await protect(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledWith();
  });
});
