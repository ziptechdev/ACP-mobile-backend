import { NextFunction, Request, Response } from 'express';
import { verifyIndentiy } from '../services/api/jumio.service';
import { httpResponse } from '../utils/httpResponse';
import httpStatus from 'http-status';

export const ResidentIdentityVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = await verifyIndentiy(req);

    httpResponse(res, {}, httpStatus.CREATED);
  } catch (error: any) {
    next(error);
  }
};
