import { NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/api.error';
import { appContainer } from '../main';
import  TYPES  from '../Types';
import ITokenService from '../services/interfaces/token.service.interface';

interface AuthenticatedRequest extends Request {
  user: unknown;
}
export default function (req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const TokenService = appContainer.get<ITokenService>(TYPES.TokenService);
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = TokenService.validateAccessToken(accessToken);

    if (typeof userData === 'string') {
      return next(ApiError.InternalError('Something went wrong'));
    }

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
