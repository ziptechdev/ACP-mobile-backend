import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function httpLogger(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  logger.info(`${request.method} ${request.path}`);
  next();
}
