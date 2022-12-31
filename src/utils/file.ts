import { Request } from 'express';
import { Multer } from 'multer';

export const parseFileBufferFromRequest = (
  request: Request,
  key: string
): any => {
  return request.files instanceof Array
    ? request.files[0]
    : request.files[key][0];
};
