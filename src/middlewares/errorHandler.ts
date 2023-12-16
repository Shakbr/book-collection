import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';
import { ValidationError } from 'sequelize';
import { HttpStatus } from '@/utils/httpStatusCodesUtils';

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string | object = `Internal Server Error: ${err}`;
  switch (true) {
    case err instanceof ApiError:
      statusCode = err.status;
      message = err.message;
      break;
    case err instanceof ValidationError:
      statusCode = HttpStatus.BAD_REQUEST;
      message = err.errors.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      break;
  }

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
