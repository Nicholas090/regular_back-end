import { NextFunction, Request, Response } from 'express';
import { TypedRequestBody } from '../../requestType';
import { LoginBody, RegistrationBody } from '../../request.interfaces';

export default interface IUserController {
  registration: (req: TypedRequestBody<RegistrationBody>, res: Response, next: NextFunction) => void;
  login: (req: TypedRequestBody<LoginBody>, res: Response, next: NextFunction) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;
  refresh: (req: Request, res: Response, next: NextFunction) => void;
}
