import { isAdmin } from './../utils/authUtils';
import { Book } from '../models/Book';
import { ApiError } from '../errors/ApiError';
import { UserDTO } from '@/types/types';

export const findBookOrThrow = async (bookId: string | number, user: UserDTO): Promise<Book> => {
  const book = await Book.findByPk(bookId);
  if (!book) {
    throw ApiError.notFound(`Book not found with ID: ${bookId}`);
  } else if (book.userId !== user.id && !isAdmin(user)) {
    throw ApiError.forbidden('You do not have permission to access this resource');
  }
  return book;
};
