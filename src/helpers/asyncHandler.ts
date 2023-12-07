import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../utils/httpStatusCodes';

export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>,
  status: HttpStatus = HttpStatus.OK,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      res.status(status).json(result);
    } catch (error) {
      next(error);
    }
  };
};
