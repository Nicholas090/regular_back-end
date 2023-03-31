export default class ApiError extends Error {
  status: number;
  err: Error;

  constructor(status: number, message: string, err = []) {
    super(message);
    this.status = status;
  }

  static UnauthorizedError(): ApiError {
    throw new ApiError(404, 'User not authorized', []);
  }

  static BadRequest(message: string, err?: any): ApiError {
    throw new ApiError(401, message, err);
  }

  static validationUserError(message: string, err?: any): ApiError {
    throw new ApiError(401, message, err);
  }
}
