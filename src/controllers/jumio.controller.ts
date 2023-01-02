import { NextFunction, Request, Response } from 'express';
import {
  getUserJumioVerificationProcess,
  startIndentityVerification,
} from '../services/api/jumio.service';
import { httpResponse } from '../utils/httpResponse';
import httpStatus from 'http-status';
import { sendEmail } from '../mailer';
import { fromEmailAddress } from '../config/vars';
import { EmailVerificationParams } from '../shared/types/userTypes/params';
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
    console.log(data);
    // await sendEmail({
    //   from: fromEmailAddress,
    //   to: 'test@callback.com',
    //   subject: 'Test callback',
    //   html: `<h2>Test callback</h2>`,
    // });
    httpResponse(res, {}, httpStatus.OK);
  } catch (error: any) {
    next(error);
  }
};
