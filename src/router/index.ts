import { Router } from 'express';
import authMiddleware from '../middlewares/auth-middleware';
import IUserController from '../controllers/user.controller.interface';
import { createUserValid } from '../middlewares/registration.validator.middleware';

function routerFunc(UserController: IUserController) {
  const router: Router = Router();

  router.post('/registration', createUserValid, UserController.registration.bind(UserController) as IUserController['registration']);
  router.post('/login', UserController.login.bind(UserController) as IUserController['login']);
  router.post('/logout', UserController.logout.bind(UserController) as IUserController['logout']);
  router.get('/refresh', authMiddleware, UserController.refresh.bind(UserController) as IUserController['refresh']);

  return router;
}
export default routerFunc;
