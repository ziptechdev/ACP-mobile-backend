import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import {
  eligibilityCheckPayload,
  eligibilityCheckSuccessResponsePendingCert,
  NvError,
  NvValidationError,
} from '../shared/types/nationalVerifierTypes';
import { eligibilityCheckSuccessResponseMock } from '../shared/mocks/nationalVerifier/eligibilityCheckMocks';
import { labelNvError } from '../utils/labelNvError';

export const eligibilityCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO call National Verifier eligibility check api with the below payload
    //const payload = Object.assign({}, req.body) as eligibilityCheckPayload;
    // For now we will mock the response

    res
      .status(httpStatus.OK)
      .json(
        eligibilityCheckSuccessResponseMock as eligibilityCheckSuccessResponsePendingCert
      );
  } catch (error: any) {
    next(labelNvError(error));
  }
};
