import { Request } from 'express';
import { HttpError } from './httpError';
import { ErrorTypes } from '../config/constants';

export const parseFileBufferFromRequest = (
  request: Request,
  key: string
): any => {
  if (request.files instanceof Array) {
    return request.files[0];
  } else {
    if (!request.files[key]) {
      throw new HttpError(
        422,
        `Missing file: ${key}`,
        ErrorTypes.VALIDATION_ERROR
      );
    }
    return request.files[key][0];
  }
};
