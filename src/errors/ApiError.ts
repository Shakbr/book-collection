import { HttpStatus } from './../utils/httpStatusCodes';

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
}
