import { NextFunction, Request, Response } from 'express';
import {
  getUserJumioVerificationProcess,
  getVerificationProcessStatus,
  jumioProcessCallback,
  startIndentityVerification,
} from '../services/api/jumio.service';
import { httpResponse } from '../utils/httpResponse';
import httpStatus from 'http-status';
import { sendEmail } from '../mailer';
import { fromEmailAddress } from '../config/vars';
import { EmailVerificationParams } from '../shared/types/userTypes/params';
import { JumioCallbackParameters } from '../shared/types/jumoTypes/jumioCallbackParametersTypes';
import JumioVerificationProcesses from '../models/JumioVerificationProcesses';
import { VerificationProcessStatus } from '../shared/types/jumoTypes/verificationProcessStatus';

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
