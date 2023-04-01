import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import TYPES from './Types';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { Express } from 'express';
import IUserController from './controllers/interfaces/user.controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import TokenService from './services/token-service';
import UserController from './controllers/user.controller';
import IUserService from './services/interfaces/user.service.interface';
import { UserService } from './services/user-service';
import ITokenService from './services/interfaces/token.service.interface';
import UserRouter from './routers/userRouter';
import IUserRouter from './routers/interfaces/userRouter.interface';
import 'reflect-metadata';

dotenv.config();
const app: Express = express();
export const appContainer = new Container();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<ITokenService>(TYPES.TokenService).to(TokenService);
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserRouter>(TYPES.UserRouter).to(UserRouter);

});
appContainer.load(appBindings);

const logger = appContainer.get<ILogger>(TYPES.ILogger);
const userRouter = appContainer.get<IUserRouter>(TYPES.UserRouter);

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', userRouter.init());
app.use(errorMiddleware);
const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => logger.log('Server started on port: ', PORT));
  } catch (e) {
    console.log('Server error: ', e);
  }
};

start();
