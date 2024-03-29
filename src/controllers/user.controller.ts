import { Request, Response, NextFunction } from 'express';
import {
  generateHashedValue,
  generateRandomDigit,
} from '../utils/dataGenerators';
import { formatCardExpirationDate } from '../utils/date';
import {
  loginUser,
  logoutUser,
  refreshUserToken,
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
  EligibilityRegisterParams,
  KYCRegisterBody,
  KYCRegisterParams,
  BankAccountParams,
  EmailVerificationParams,
  LoginParams,
} from '../shared/types/userTypes/params';
import {
  serializeAuthUser,
  serializeEligibleUser,
  serializeKycUser,
} from '../serializers/users';
import { registerUserBankAccount } from '../services/db/bankAccounts.service';
import User from '../models/User';
import { httpResponse } from '../utils/httpResponse';
import { sendEmail } from '../mailer';
import { fromEmailAddress } from '../config/vars';

export const eligibilityRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eligibilityCheckId = req.params.eligibilityCheckId;
    const data = Object.assign({}, req.body) as EligibilityRegisterParams;
    const hashedPassword = await generateHashedValue(data.password);
    const user = await registerEligibleUser(
      eligibilityCheckId,
      filterParams<EligibilityRegisterParams>(
        { ...data, password: hashedPassword },
        eligibilityRegisterWhiteListedParams
      )
    );
    httpResponse(res, serializeEligibleUser(user), httpStatus.CREATED);
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
      generateHashedValue(data.password),
      generateHashedValue(data.bankNumber),
      generateHashedValue(data.accountNumber),
      formatCardExpirationDate(data.expirationDate),
    ]);

    const user = await User.transaction(async trx => {
      const kycRegistration = await registerKycUser(
        trx,
        filterParams<KYCRegisterParams>(
          { ...data, password: hashedPassword },
          kycRegisterUserWhiteListedParams
        )
      );

      await registerUserBankAccount(
        trx,
        kycRegistration,
        filterParams<BankAccountParams>(
          {
            ...data,
            bankNumber: hashedBankNumber,
            accountNumber: hashedAccountNumber,
            expirationDate: formatedExpirationDate,
          },
          kycRegisterBankAccountWhiteListedParams
        )
      );

      return kycRegistration;
    });

    httpResponse(res, serializeKycUser(user), httpStatus.CREATED);
  } catch (error: any) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = Object.assign({}, req.body) as EmailVerificationParams;
    const code = generateRandomDigit(5);

    await sendEmail({
      from: fromEmailAddress,
      to: data.email,
      subject: 'Email verification',
      html: `<h2>${code}</h2>`,
    });

    httpResponse(
      res,
      { verificationCode: code },
      httpStatus.OK,
      'Verification Email sent.'
    );
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = Object.assign({}, req.body) as LoginParams;
    const user = await loginUser(data.username, data.password);

    httpResponse(
      res,
      serializeAuthUser(user),
      httpStatus.CREATED,
      'User Authenticated'
    );
  } catch (error: any) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await refreshUserToken(req.user, req.token);

    httpResponse(
      res,
      serializeAuthUser(user),
      httpStatus.CREATED,
      'New token generated!'
    );
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await logoutUser(req.user.id, req.token);

    httpResponse(res, {}, httpStatus.CREATED, 'Token deleted!');
  } catch (error: any) {
    next(error);
  }
};
