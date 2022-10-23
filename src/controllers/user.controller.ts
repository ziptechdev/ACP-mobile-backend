import { Request, Response, NextFunction } from 'express';
import { generateHashedValue } from '../utils/generateHash';
import {
  EligibilityRegisterBody,
  EligibilityRegisterParams,
} from '../shared/types/userTypes/eligibilityRegister/eligibilityRegisterTypes';
import {
  registerEligibleUser,
  registerKycUser,
} from '../services/db/users/users.service';
import { filterParams } from '../shared/types';
import { eligibilityRegisterWhiteListedParams } from '../shared/types/userTypes/eligibilityRegister/whiteListedParams';
import httpStatus from 'http-status';
import { serializeEligibleUser, serializeKycUser } from '../serializers/users';
import {
  KYCRegisterBody,
  KYCRegisterParams,
} from '../shared/types/userTypes/kycRegister/kycRegisterTypes';
import {
  kycRegisterBankAccountWhiteListedParams,
  kycRegisterUserWhiteListedParams,
} from '../shared/types/userTypes/kycRegister/whiteListedParams';
import { registerUserBankAccount } from '../services/db/bank_accounts/bankAccounts.service';
import { RegisterUserBankAccountParams } from '../services/db/bank_accounts/params';

export const eligibilityRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eligibilityCheckId = req.params.eligibilityCheckId;
    const data = Object.assign({}, req.body) as EligibilityRegisterBody;
    const hashedPassword = await generateHashedValue(data.user.password);
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
    const data = Object.assign({}, req.body) as KYCRegisterBody;
    const hashedPassword = await generateHashedValue(data.user.password);
    const hashedBankNumber = await generateHashedValue(
      data.bank_account.bank_number
    );
    const hashedAccountNumber = await generateHashedValue(
      data.bank_account.account_number
    );

    const user = await registerKycUser(
      filterParams<KYCRegisterParams>(
        { ...data.user, password: hashedPassword },
        kycRegisterUserWhiteListedParams
      )
    );

    //TODO: KYC Verification

    await registerUserBankAccount(
      user.id,
      filterParams<RegisterUserBankAccountParams>(
        {
          ...data.bank_account,
          bank_number: hashedBankNumber,
          account_number: hashedAccountNumber,
        },
        kycRegisterBankAccountWhiteListedParams
      )
    );

    res.status(httpStatus.CREATED).json(serializeKycUser(user));
  } catch (error: any) {
    next(error);
  }
};
