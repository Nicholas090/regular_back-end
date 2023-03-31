import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import IUserController from './user.controller.interface';
import ILogger from '../logger/logger.service.interface';
import { TYPES } from '../Types';
import 'reflect-metadata';
import IUserService from '../services/interfaces/user.service.interface';

@injectable()
class UserController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
  ) {}

  async registration(req: Request, res: Response, next: NextFunction): Promise<object | void> {
    try {
      this.logger.log('Registartion');

      const { email, password, userNickName, userName } = req.body;
      const user = await this.userService.registration(email, password, userNickName, userName);
      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 30 * 24 * 68 * 68 * 1000,
        httpOnly: true,
      });

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      this.logger.log('login');
      const { email, password } = req.body;
      const userData = await this.userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 68 * 68 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      this.logger.log('logout');
      const { refreshToken } = req.cookies;
      const token = await this.userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.logger.log('Refresh Token');
      const { refreshToken } = req.cookies;
      const userData = await this.userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 68 * 68 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
