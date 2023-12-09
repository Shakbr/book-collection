import { Response, NextFunction } from 'express';
import { Book } from '@/models/Book';
import { findBookOrThrow } from '@/helpers/bookHelpers';
import { asyncHandler } from '@/helpers/asyncHandler';
import { HttpStatus } from '@/utils/httpStatusCodesUtils';
import { AuthRequest } from '@/types/types';
import { isAdmin } from '@/utils/authUtils';

export class BookController {
  create = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    return await Book.create({ ...req.body, userId: req.user.id, lastReadPage: 0 });
  }, HttpStatus.CREATED);

  findAll = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    let query = {};
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const offset = (page - 1) * limit;
    if (!isAdmin(req.user)) {
      query = { userId: req.user.id };
    }
    const { count, rows: books } = await Book.findAndCountAll({
      where: query,
      limit,
      offset,
      order: [['createdAt', 'ASC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      books,
      totalItems: count,
      totalPages,
      currentPage: page,
    };
  });

  findOne = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    return await findBookOrThrow(req.params.id, req.user);
  });

  update = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const book = await findBookOrThrow(req.params.id, req.user);
    if ('lastReadPage' in req.body) {
      const totalPages = book.content.length;
      if (req.body.lastReadPage < 1 || req.body.lastReadPage > totalPages) {
        throw new Error(`Invalid last read page number, must be between 1 and total number of pages ${totalPages}}`);
      }
    }
    return await book.update(req.body);
  });

  delete = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const book = await findBookOrThrow(req.params.id, req.user);
    await book.destroy();
    return {};
  }, HttpStatus.NO_CONTENT);
}
