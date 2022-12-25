import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import {
  eligibilityCheckPayload,
  eligibilityCheckSuccessResponsePendingCert,
} from '../shared/types/nationalVerifierTypes';
import { eligibilityCheckSuccessResponseMock } from '../shared/mocks/nationalVerifier/eligibilityCheckMocks';
import { filterParams } from '../shared/types';
import { CreateEligibleUserParams } from '../shared/types/userTypes/params';
import { createEligibleUserWhiteListedParams } from '../shared/types/userTypes/whiteListedParams';
import { findOrCreateEligibleUser } from '../services/db/users.service';
import { httpResponse } from '../utils/httpResponse';

export const eligibilityCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO call National Verifier eligibility check api with the below payload
    const payload = Object.assign({}, req.body) as eligibilityCheckPayload;
    // use axios for calling the api
    // some fields are different: dateOfBirth is dob, ssn4 - only last 4 digits of social security number are sent
    // and phoneNumber is not sent

    // For now we will mock the response
    const response = eligibilityCheckSuccessResponseMock;
    // for now we ignore the response, but if there is need this method returns the user that is found or created
    await findOrCreateEligibleUser(
      filterParams<CreateEligibleUserParams>(
        {
          ...payload,
          eligibilityCheckId: response.eligibilityCheckId,
          applicationId: response.applicationId,
          eligibilityCheckStatus: response.status,
        },
        createEligibleUserWhiteListedParams
      )
    );
    httpResponse(
      res,
      response as eligibilityCheckSuccessResponsePendingCert,
      httpStatus.OK
    );
  } catch (error: any) {
    // somehow try to figure out from the error format if it came from the external api and label it if it has
    // so it is formatted correctly in the error handler
    // if from_nv_api then error = labelNvError(error)
    next(error);
  }
};
