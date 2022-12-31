import { NextFunction, Request, Response } from 'express';
import { startIndentityVerification } from '../services/api/jumio.service';
import { httpResponse } from '../utils/httpResponse';
import httpStatus from 'http-status';

export const ResidentIdentityVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await startIndentityVerification(req);
    console.log(data);
    httpResponse(res, data, httpStatus.CREATED);
  } catch (error: any) {
    next(error);
  }
};
