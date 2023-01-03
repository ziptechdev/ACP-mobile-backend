import { NextFunction, Request, Response } from 'express';
import {
  jumioProcessCallback,
  startIndentityVerification,
} from '../services/api/jumio.service';
import { httpResponse } from '../utils/httpResponse';
import httpStatus from 'http-status';
import { JumioCallbackParameters } from '../shared/types/jumoTypes/jumioCallbackParametersTypes';

export const ResidentIdentityVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await startIndentityVerification(req);
    httpResponse(res, data, httpStatus.CREATED);
  } catch (error: any) {
    next(error);
  }
};

export const jumioCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = Object.assign({}, req.body) as JumioCallbackParameters;

    await jumioProcessCallback(data);
    httpResponse(res, {}, httpStatus.OK);
  } catch (error: any) {
    next(error);
  }
};
