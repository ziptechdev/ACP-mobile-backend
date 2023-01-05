import { NextFunction, Request, Response } from 'express';
import {
  CheckViolationError,
  DataError,
  ForeignKeyViolationError,
  NotFoundError,
  NotNullViolationError,
  UniqueViolationError,
  ValidationError,
} from 'objection';

import { env } from '../config/vars';
import { HttpError } from '../utils/httpError';
import logger from '../config/logger';
import { ErrorTypes } from '../config/constants';
import httpStatus from 'http-status';
import { MulterError } from 'multer';
import { AxiosError } from 'axios';

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    statusCode: err.status,
    message: err.message,
    data: {
      type: err.type,
      stack: err.stack,
      ...err.data,
    },
  };

  if (env !== 'development') {
    delete response.data.stack;
  }

  logger.error(err);

  res.status(err.status).send(response);
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
  } else if (err?.errorType === ErrorTypes.NV_VALIDATION_ERROR) {
    convertedError = new HttpError(
      httpStatus.BAD_REQUEST,
      err.message,
      ErrorTypes.NV_VALIDATION_ERROR,
      { errors: err.errors }
    );
  } else if (err?.errorType === ErrorTypes.NV_INTERNAL_ERROR) {
    convertedError = new HttpError(
      httpStatus.BAD_REQUEST,
      err.message,
      ErrorTypes.NV_INTERNAL_ERROR,
      { links: err.links }
    );
  } else if (err instanceof MulterError) {
    convertedError = new HttpError(
      422,
      `${err.message} ${err.field}`,
      ErrorTypes.VALIDATION_ERROR
    );
  } else if (err instanceof AxiosError) {
    convertedError = new HttpError(
      err.response.status,
      `${err.message} ${err.response.data.title ?? ''}`,
      ErrorTypes.SERVICE_ERROR
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
