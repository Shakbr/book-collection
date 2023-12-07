import { Book } from '../models/Book';
import { ApiError } from '../errors/ApiError';

export const findBookOrThrow = async (bookId: string | number): Promise<Book> => {
  const book = await Book.findByPk(bookId);
  if (!book) {
    throw ApiError.notFound('Book not found');
  }
  return book;
};
