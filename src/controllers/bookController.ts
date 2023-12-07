import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/Book';
import { findBookOrThrow } from '../helpers/bookHelpers';
import { asyncHandler } from '../helpers/asyncHandler';
import { HttpStatus } from '../utils/httpStatusCodes';

export class BookController {
  create = asyncHandler(async (req: Request, _res: Response, _next: NextFunction) => {
    return await Book.create(req.body);
  }, HttpStatus.CREATED);

  findAll = asyncHandler(async (_req: Request, _res: Response, _next: NextFunction) => {
    return await Book.findAll();
  });

  findOne = asyncHandler(async (req: Request, _res: Response, _next: NextFunction) => {
    return await findBookOrThrow(req.params.id);
  });

  update = asyncHandler(async (req: Request, _res: Response, _next: NextFunction) => {
    const book = await findBookOrThrow(req.params.id);
    return await book.update(req.body);
  });

  delete = asyncHandler(async (req: Request, _res: Response, _next: NextFunction) => {
    const book = await findBookOrThrow(req.params.id);
    await book.destroy();
    return {};
  }, HttpStatus.NO_CONTENT);
}
