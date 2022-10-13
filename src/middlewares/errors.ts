import { NextFunction, Request, Response } from 'express';
import {
  UniqueViolationError,
  NotFoundError,
  NotNullViolationError,
  ValidationError,
  DataError,
  ForeignKeyViolationError,
  CheckViolationError,
  // these 2 are base error clases, so no need to check them explicitly
  ConstraintViolationError,
  DBError,
} from 'objection';

import { env } from '../config/vars';
import { HttpError } from '../utils/httpError';
import logger from '../config/logger';
import { ErrorTypes } from '../config/constants';

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    message: err.message,
    data: err.data,
    type: err.type,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  logger.error(err);

  res.status(err.status).send({ error: response });
};

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let convertedError = err;

  if (err instanceof ValidationError) {
    convertedError = new HttpError(
      err.statusCode,
      env === 'development' ? err.message : err.name,
      ErrorTypes.DB_ERROR,
      err.data || {}
    );
  } else if (err instanceof NotFoundError) {
    convertedError = new HttpError(
      err.statusCode,
      env === 'development' ? err.message : err.name,
      ErrorTypes.NOT_FOUND_ERROR,
      env === 'development' ? err.data || {} : {}
    );
  } else if (err instanceof UniqueViolationError) {
    convertedError = new HttpError(
      409,
      env === 'development' ? err.message : err.name,
      ErrorTypes.UNIQUE_VIOLATION_ERROR,
      env === 'development'
        ? {
            table: err.table,
            column: err.columns,
            constraint: err.constraint,
          }
        : {}
    );
  } else if (err instanceof NotNullViolationError) {
    convertedError = new HttpError(
      400,
      env === 'development' ? err.message : err.name,
      ErrorTypes.DB_ERROR,
      env === 'development'
        ? {
            table: err.table,
            column: err.column,
          }
        : {}
    );
  } else if (err instanceof ForeignKeyViolationError) {
    convertedError = new HttpError(
      409,
      env === 'development' ? err.message : err.name,
      ErrorTypes.DB_ERROR,
      env === 'development'
        ? {
            table: err.table,
            constraint: err.constraint,
          }
        : {}
    );
  } else if (err instanceof DataError) {
    convertedError = new HttpError(
      400,
      env === 'development' ? err.message : err.name,
      ErrorTypes.DB_ERROR
    );
  } else if (err instanceof CheckViolationError) {
    convertedError = new HttpError(
      400,
      env === 'development' ? err.message : err.name,
      ErrorTypes.DB_ERROR,
      env === 'development'
        ? {
            table: err.table,
            constraint: err.constraint,
          }
        : {}
    );
  } else if (!(err instanceof HttpError)) {
    convertedError = new HttpError(
      500,
      err.message,
      ErrorTypes.INTERNAL_SERVER_ERROR
    );
  }

  next(convertedError);
};

export const noEndpointError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new HttpError(
    404,
    'Page does not exist',
    ErrorTypes.NO_ENDPOINT_ERROR
  );

  next(err);
};
