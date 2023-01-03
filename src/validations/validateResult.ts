import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from '../utils/httpError';
import { ErrorTypes } from '../config/constants';

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(422, 'Validation Error', ErrorTypes.VALIDATION_ERROR, {
      errors: errors.array({ onlyFirstError: true }),
    });
  }

  return next();
};
