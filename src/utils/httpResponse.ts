import { Response } from 'express';
import httpStatus from 'http-status';

export const httpResponse = (
  res: Response,
  data: object,
  statusCode = 200,
  message?: string
): void => {
  res.status(statusCode).json({
    statusCode,
    message: message ?? httpStatus[`${statusCode}_MESSAGE`],
    data,
  });
};
