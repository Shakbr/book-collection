import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { authenticateUser } from '../services/authService';
import { ApiError } from '../errors/ApiError';
import { asyncHandler } from '../helpers/asyncHandler';
import { HttpStatus } from '../utils/httpStatusCodesUtils';

export class UserController {
  register = asyncHandler(async (req: Request, _res: Response, _next: NextFunction) => {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.badRequest('Email already in use');
    }

    return (await User.create({ email, name, password })).toDTO();
  }, HttpStatus.CREATED);

  login = asyncHandler(async (req: Request, _res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    const authResult = await authenticateUser(email, password);

    if (!authResult) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    return { token: authResult.token };
  });
}
