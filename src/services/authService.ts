import { User } from '@/models/User';
import { ApiError } from '@/errors/ApiError';
import bcrypt from 'bcrypt';
import { UserDTO } from '@/types/types';
import { generateToken } from '@/utils/authUtils';

interface AuthenticateUser {
  user: UserDTO;
  token: string;
}

export const authenticateUser = async (email: string, password: string): Promise<AuthenticateUser> => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw ApiError.unauthorized('Email not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const userDTO = user.toDTO();
  return { user: userDTO, token: generateToken(userDTO) };
};
