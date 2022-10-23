import { Request, Response, NextFunction } from 'express';
import { generateHashPassword } from '../utils/generateHash';

import { filterParams } from '../shared/types';
import httpStatus from 'http-status';
import { serializeEligibleUser } from '../serializers/users';
import { eligibilityRegisterWhiteListedParams } from '../shared/types/userTypes/whiteListedParams';
import {
  EligibilityRegisterBody,
  EligibilityRegisterParams,
} from '../shared/types/userTypes/params';
import { registerEligibleUser } from '../services/db/users.service';

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
