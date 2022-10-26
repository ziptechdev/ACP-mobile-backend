import { Request, Response, NextFunction } from 'express';
import { generateHashedValue } from '../utils/generateHash';
import { formatCardExpirationDate } from '../utils/date';
import {
  registerEligibleUser,
  registerKycUser,
} from '../services/db/users.service';
import { filterParams } from '../shared/types';
import httpStatus from 'http-status';
import {
  eligibilityRegisterWhiteListedParams,
  kycRegisterBankAccountWhiteListedParams,
  kycRegisterUserWhiteListedParams,
} from '../shared/types/userTypes/whiteListedParams';
import {
  EligibilityRegisterBody,
  EligibilityRegisterParams,
  KYCRegisterBody,
  KYCRegisterParams,
  BankAccountParams,
} from '../shared/types/userTypes/params';
import { serializeEligibleUser, serializeKycUser } from '../serializers/users';
import { registerUserBankAccount } from '../services/db/bankAccounts.service';
import User from '../models/User';
import { httpResponse } from '../utils/httpResponse';

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
    httpResponse(res, serializeEligibleUser(user), httpStatus.OK);
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

    const [
      hashedPassword,
      hashedBankNumber,
      hashedAccountNumber,
      formatedExpirationDate,
    ] = await Promise.all([
      generateHashedValue(data.user.password),
      generateHashedValue(data.bankAccount.bankNumber),
      generateHashedValue(data.bankAccount.accountNumber),
      formatCardExpirationDate(data.bankAccount.expirationDate),
    ]);

    const user = await User.transaction(async trx => {
      const kycRegistration = await registerKycUser(
        trx,
        filterParams<KYCRegisterParams>(
          { ...data.user, password: hashedPassword },
          kycRegisterUserWhiteListedParams
        )
      );

      await registerUserBankAccount(
        trx,
        kycRegistration,
        filterParams<BankAccountParams>(
          {
            ...data.bankAccount,
            bankNumber: hashedBankNumber,
            accountNumber: hashedAccountNumber,
            expirationDate: formatedExpirationDate,
          },
          kycRegisterBankAccountWhiteListedParams
        )
      );

      return kycRegistration;
    });

    //TODO: KYC Verification

    httpResponse(res, serializeKycUser(user), httpStatus.CREATED);
  } catch (error: any) {
    next(error);
  }
};
