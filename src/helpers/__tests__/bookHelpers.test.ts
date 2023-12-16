import { userDTO } from './../../testUtils/testData';
import { ApiError } from '../../errors/ApiError';
import { Book } from '../../models/Book';
import { isAdmin } from '../../utils/authUtils';
import { findBookOrThrow } from '../bookHelpers';

jest.mock('../../models/Book');
jest.mock('./../../utils/authUtils');

describe('findBookOrThrow', () => {
  it('should throw a not found error if the book does not exist', async () => {
    (Book.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(findBookOrThrow(1, userDTO)).rejects.toThrow(ApiError.notFound(`Book not found with ID: 1`));
  });

  it('should return the book if the user owns the book', async () => {
    (Book.findByPk as jest.Mock).mockResolvedValue({ userId: 1 });

    const book = await findBookOrThrow(1, userDTO);

    expect(book).toEqual({ userId: 1 });
  });

  it('should throw a forbidden error if the user is not an admin and does not own the book', async () => {
    (Book.findByPk as jest.Mock).mockResolvedValue({ userId: 2 });
    (isAdmin as jest.Mock).mockReturnValue(false);

    await expect(findBookOrThrow(1, userDTO)).rejects.toThrow(
      ApiError.forbidden('You do not have permission to access this resource'),
    );
  });

  it('should return the book if the user is an admin and does not own the book', async () => {
    (Book.findByPk as jest.Mock).mockResolvedValue({ userId: 2 });
    (isAdmin as jest.Mock).mockReturnValue(true);

    const book = await findBookOrThrow(1, userDTO);

    expect(book).toEqual({ userId: 2 });
  });
});
