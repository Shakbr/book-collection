import { HttpStatus } from './../utils/httpStatusCodesUtils';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message);
  }

  static badRequest(msg: string): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, msg);
  }

  static notFound(msg: string): ApiError {
    return new ApiError(HttpStatus.NOT_FOUND, msg);
  }

  static unauthorized(msg: string): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, msg);
  }

  static forbidden(msg: string): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, msg);
  }

  static conflict(msg: string): ApiError {
    return new ApiError(HttpStatus.CONFLICT, msg);
  }
}
