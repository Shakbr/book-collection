import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../utils/httpStatusCodesUtils';

export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};
