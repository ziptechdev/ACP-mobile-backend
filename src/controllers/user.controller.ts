import { Request, Response, NextFunction } from 'express';
import { generateHashPassword } from '../utils/generateHash';
import {
  EligibilityRegisterBody,
  EligibilityRegisterParams,
} from '../shared/types/userTypes/eligibilityRegister/eligibilityRegisterTypes';
import { registerEligibleUser } from '../services/db/users/users.service';
import { filterParams } from '../shared/types';
import { eligibilityRegisterWhiteListedParams } from '../shared/types/userTypes/eligibilityRegister/whiteListedParams';
import httpStatus from 'http-status';
import { serializeEligibleUser } from '../serializers/users';

export const eligibilityRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eligibilityCheckId = req.params.eligibilityCheckId;
    const data = Object.assign({}, req.body) as EligibilityRegisterBody;
    const hashedPassword = await generateHashPassword(data.user.password);
    const user = await registerEligibleUser(
      eligibilityCheckId,
      filterParams<EligibilityRegisterParams>(
        { ...data.user, password: hashedPassword },
        eligibilityRegisterWhiteListedParams
      )
    );
    res.status(httpStatus.OK).send(serializeEligibleUser(user));
  } catch (error: any) {
    next(error);
  }
};

export const kycRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(httpStatus.OK).json(req.body);
  } catch (error: any) {
    next(error);
  }
};
