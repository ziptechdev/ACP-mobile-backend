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
} from '../shared/types/userTypes/params';
import { serializeEligibleUser, serializeKycUser } from '../serializers/users';
import { registerUserBankAccount } from '../services/db/bankAccounts.service';
import { RegisterUserBankAccountParams } from '../services/db/bank_accounts/params';
import User from '../models/User';

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
    const formatedExpirationDate = formatCardExpirationDate(
      data.bank_account.expiration_date
    );

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
        filterParams<RegisterUserBankAccountParams>(
          {
            ...data.bank_account,
            bank_number: hashedBankNumber,
            account_number: hashedAccountNumber,
            expiration_date: formatedExpirationDate,
          },
          kycRegisterBankAccountWhiteListedParams
        )
      );

      return kycRegistration;
    });

    //TODO: KYC Verification

    res.status(httpStatus.CREATED).json(serializeKycUser(user));
  } catch (error: any) {
    next(error);
  }
};
