import { body, param } from 'express-validator';
import { validateResult } from './validateResult';
import { ELIGIBILITY_CHECK_ID_LENGTH } from '../config/constants';
import { isPasswordConfirmedValidationRule } from './rules/isPasswordConfirmed.validationRule';
import { isCardDateInTheFutureValidationRule } from './rules/isCardDateInTheFuture.validationRule';
import { isExistingUsernameValidationRule } from './rules/isExistingUsername.validationRule';
import { isExistingSocialSecurityNumberValidationRule } from './rules/isExistingSocialSecurityNumber.validationRule';

// [POST] /api/v1/users/eligibility-register/:eligibilityCheckId
export const eligibilityRegisterValidation = [
  param('eligibilityCheckId').exists().isLength({
    min: ELIGIBILITY_CHECK_ID_LENGTH,
    max: ELIGIBILITY_CHECK_ID_LENGTH,
  }),
  body('user').exists(),
  body('user.username').exists().isEmail(),
  body('user.password').exists().isLength({ min: 6 }).isLength({ max: 40 }),
  validateResult,
];

// [POST] /api/v1/users/kyc-register
export const kycRegisterValidation = [
  body('user').exists(),
  body('user.firstName').exists().isLength({ min: 3, max: 20 }),
  body('user.lastName').exists().isLength({ min: 3, max: 20 }),
  body('user.username')
    .exists()
    .isEmail()
    .custom(isExistingUsernameValidationRule),
  body('user.password')
    .exists()
    .isStrongPassword()
    .custom(isPasswordConfirmedValidationRule),
  body('user.phoneNumber').exists(),
  body('user.socialSecurityNumber')
    .exists()
    .matches(/^(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/)
    .custom(isExistingSocialSecurityNumberValidationRule),
  body('bankAccount').exists(),
  body('bankAccount.bankName').exists().isLength({ min: 3, max: 20 }),
  body('bankAccount.bankNumber').exists(),
  body('bankAccount.accountHolderName').exists().isLength({ min: 3, max: 20 }),
  body('bankAccount.accountNumber').exists(),
  body('bankAccount.expirationDate')
    .exists()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/g)
    .custom(isCardDateInTheFutureValidationRule),
  validateResult,
];
