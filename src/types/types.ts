import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: UserDTO;
}

export interface UserData {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
}

export type UserDTO = Omit<UserData, 'password'>;

export interface BookData {
  title: string;
  content: string[];
  lastReadPage: number;
  author: string;
}
