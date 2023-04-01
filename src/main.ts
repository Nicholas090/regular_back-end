import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import TYPES from './Types';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as multer from 'multer';
import * as fs from 'fs';
import { Express, Request, Response } from 'express';
import IUserController from './controllers/interfaces/user.controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import TokenService from './services/token.service';
import UserController from './controllers/user.controller';
import IUserService from './services/interfaces/user.service.interface';
import { UserService } from './services/user.service';
import ITokenService from './services/interfaces/token.service.interface';
import UserRouter from './routers/user.router';
import IUserRouter from './routers/interfaces/user.router.interface';
import IPostController from './controllers/interfaces/post.controller.interface';
import IPostService from './services/interfaces/post.service.interface';
import { PostService } from './services/post.service';
import PostController from './controllers/post.controller';
import PostRouter from './routers/post.router';
import IPostRouter from './routers/interfaces/post.rouer.interface';
import authMiddleware from './middlewares/auth.middleware';
import 'reflect-metadata';

dotenv.config();
const app: Express = express();
export const appContainer = new Container();


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

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
  bind<IPostController>(TYPES.PostController).to(PostController);
  bind<IPostService>(TYPES.PostService).to(PostService);
  bind<IPostRouter>(TYPES.PostRouter).to(PostRouter);
  bind<IUserRouter>(TYPES.UserRouter).to(UserRouter);

});
appContainer.load(appBindings);

const logger = appContainer.get<ILogger>(TYPES.ILogger);
const userRouter = appContainer.get<IUserRouter>(TYPES.UserRouter);
const postRouter = appContainer.get<IPostRouter>(TYPES.PostRouter);

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));
app.post('/upload', authMiddleware, upload.single('image'), (req: Request, res: Response) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.use('/api', userRouter.init());
app.use('/api/data', postRouter.init());
app.use(errorMiddleware);
const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => logger.log('Server started on port: ', PORT));
  } catch (e) {
    console.log('Server error: ', e);
  }
};

start();
