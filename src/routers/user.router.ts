import authMiddleware from '../middlewares/auth.middleware';
import { createUserValid } from '../middlewares/registration.validator.middleware';
import { Router } from 'express';
import IUserController from '../controllers/interfaces/user.controller.interface';
import { inject, injectable } from 'inversify';
import TYPES  from '../Types';
import UserController from '../controllers/user.controller';
import 'reflect-metadata';


@injectable()
class UserRouter {
  constructor(
    @inject(TYPES.UserController) private userController: IUserController,
  ) {
  }

  init() {
    const router: Router = Router();
    router.post('/registration', createUserValid.bind(createUserValid), this.userController.registration.bind(this.userController));
    router.post('/login', this.userController.login.bind(this.userController));
    router.post('/logout', this.userController.logout.bind(this.userController));
    router.get('/refresh', authMiddleware.bind(authMiddleware), this.userController.refresh.bind(this.userController));
    return router;
  }

}

export default UserRouter;
