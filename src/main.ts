import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import { TYPES } from './Types';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import { Express } from 'express';


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
});
appContainer.load(appBindings);

const logger = appContainer.get<ILogger>(TYPES.ILogger);
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors(corsOptions));

const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => logger.log('Сервер запущен'));
  } catch (e) {
    console.log(e);
  }
};

start();
