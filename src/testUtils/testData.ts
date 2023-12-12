import { Optional } from 'sequelize';
import { BookData, UserDTO, UserData } from '../types/types';
import { Role } from '../models/User';

interface UserCreationAttributes extends Optional<UserData, 'id'> {}
export const userData: UserCreationAttributes = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: Role.REGULAR,
};

export const userDTO: UserDTO = { id: 1, email: userData.email, name: userData.name, role: Role.REGULAR };

export const bookData: BookData = {
  title: 'Test Book',
  content: ['Test Content'],
  lastReadPage: 1,
  author: 'Test Author',
};
