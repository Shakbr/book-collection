import jwt from 'jsonwebtoken';
import { UserDTO } from '@/types/types';
import { Role } from '../models/User';
import { JWT_SECRET_KEY } from '@/middlewares/authMiddleware';

export const isAdmin = (user: UserDTO): boolean => {
  return user.role === Role.ADMIN;
};

export const generateToken = (userDTO: UserDTO): string => {
  return jwt.sign({ user: userDTO }, JWT_SECRET_KEY, { expiresIn: '1h' });
};
