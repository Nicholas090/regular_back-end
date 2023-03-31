import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import { TYPES } from './Types';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { Express } from 'express';
import IUserController from './controllers/user.controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import TokenService from './services/token-service';
import UserController from './controllers/user.controller';
import IUserService from './services/interfaces/user.service.interface';
import { UserService } from './services/user-service';
import ITokenService from './services/interfaces/token.service.interface';
import routerFunc from './router';


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
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<ITokenService>(TYPES.TokenService).to(TokenService);
});
appContainer.load(appBindings);

const logger = appContainer.get<ILogger>(TYPES.ILogger);
const userController = appContainer.get<IUserController>(TYPES.UserController);

const PORT = process.env.PORT;
const router = routerFunc(userController);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', router);
app.use(errorMiddleware);
const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => logger.log('Server started'));
  } catch (e) {
    console.log('Server error: ', e);
  }
};

start();
