import {  NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/api.error';
import LoggerService from '../logger/logger.service';
import ILogger from '../logger/logger.service.interface';

export default function (err: Error, req: Request, res: Response, _: NextFunction): Response {
  const logger: ILogger = new LoggerService();

  if (err instanceof ApiError) {
    logger.warn();
    return res.status(err.status).json({ error: true, message: err.message, errors: err.err });
  }

  logger.warn(err);
  return res.status(500).json({ error: true, message: 'Unknown error!' });
}
