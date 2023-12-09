import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: UserDTO;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface BookData {
  title: string;
  content: string[];
  lastReadPage: number;
  author: string;
}
