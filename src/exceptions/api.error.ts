import IApiError from './api.errors.interface';

export default class ApiError extends Error implements IApiError   {
  status: number;
  err: Error[];

  constructor(status: number, message: string, err: Error[] = []) {
    super(message);
    this.status = status;
  }

  static UnauthorizedError(): ApiError {
    throw new ApiError(401, 'User not authorized');
  }

  static BadRequest(message: string, err?: Error[]): ApiError {
    throw new ApiError(401, message, err);
  }

  static validationUserError(message: string, err?: Error[]): ApiError {
    throw new ApiError(401, message, err);
  }

  static   InternalError(message: string, err?: Error[]): ApiError {
    throw new ApiError(401, message, err);
  }

}
