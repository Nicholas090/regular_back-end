import authMiddleware from '../middlewares/auth.middleware';
import { createUserValid } from '../middlewares/registration.validator.middleware';
import { Router } from 'express';
import IUserController from '../controllers/interfaces/user.controller.interface';
import { inject, injectable } from 'inversify';
import TYPES  from '../Types';
import 'reflect-metadata';


@injectable()
class UserRouter {
  constructor(
    @inject(TYPES.UserController) private userController: IUserController,
  ) {
  }

  init() {
    const router: Router = Router();
    router.post('/registration', createUserValid, this.userController.registration.bind(this.userController) as IUserController['registration']);
    router.post('/login', this.userController.login.bind(this.userController) as IUserController['login']);
    router.post('/logout', this.userController.logout.bind(this.userController) as IUserController['logout']);
    router.get('/refresh', authMiddleware, this.userController.refresh.bind(this.userController) as IUserController['refresh']);
    return router;
  }

}

export default UserRouter;
