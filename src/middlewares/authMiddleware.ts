import { Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { AuthRequest, UserDTO } from '../types/types';

export const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET as Secret;

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw ApiError.badRequest('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    const { id, name, email, role } = decoded.user;

    const user: UserDTO = { id, name, email, role };
    req.user = user;
    next();
  } catch (error) {
    next(ApiError.unauthorized('Not authorized'));
  }
};
