import { body, param } from 'express-validator';
import { validateResult } from './validateResult';
import { ELIGIBILITY_CHECK_ID_LENGTH } from '../config/constants';
import { isPasswordConfirmedValidationRule } from './rules/isPasswordConfirmed.validationRule';
import { isCardDateInTheFutureValidationRule } from './rules/isCardDateInTheFuture.validationRule';
import { isExistingUsernameValidationRule } from './rules/isExistingUsername.validationRule';
import { isExistingSocialSecurityNumberValidationRule } from './rules/isExistingSocialSecurityNumber.validationRule';
import { hasJumioVerificationProcess } from './rules/hasJumioVerificationProcess';
import { ValidationErrorMessages } from '../models/ValidationErrorMessages';

// [POST] /api/v1/users/eligibility-register/:eligibilityCheckId
export const eligibilityRegisterValidation = [
  param('eligibilityCheckId')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  body('username')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isEmail()
    .withMessage(ValidationErrorMessages.EMAIL)
    .custom(isExistingUsernameValidationRule),
  body('password')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isStrongPassword()
    .withMessage(ValidationErrorMessages.STRONG_PASSWORD)
    .custom(isPasswordConfirmedValidationRule)
    .withMessage(ValidationErrorMessages.REPEAT_PASSWORD),
  validateResult,
];

// [POST] /api/v1/users/kyc-register/account-id/:accountId/workflow-execution-id/:workflowExecutionId
export const kycRegisterValidation = [
  body('firstName')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isLength({ min: 3, max: 20 })
    .withMessage(`${ValidationErrorMessages.RANGE} (3 - 20)`),
  body('lastName')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isLength({ min: 3, max: 20 })
    .withMessage(`${ValidationErrorMessages.RANGE} (3 - 20)`),
  body('username')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isEmail()
    .withMessage(ValidationErrorMessages.EMAIL)
    .custom(isExistingUsernameValidationRule)
    .custom(hasJumioVerificationProcess),
  body('password')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isStrongPassword()
    .withMessage(ValidationErrorMessages.STRONG_PASSWORD)
    .custom(isPasswordConfirmedValidationRule)
    .withMessage(ValidationErrorMessages.REPEAT_PASSWORD),
  body('phoneNumber').exists().withMessage(ValidationErrorMessages.REQUIRED),
  body('socialSecurityNumber')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .matches(/^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/)
    .withMessage('Invalid social security format')
    .custom(isExistingSocialSecurityNumberValidationRule),
  body('bankName')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isLength({ min: 3, max: 20 })
    .withMessage(`${ValidationErrorMessages.RANGE} (3 - 20)`),
  body('bankNumber').exists().withMessage(ValidationErrorMessages.REQUIRED),
  body('accountHolderName')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isLength({ min: 3, max: 20 })
    .withMessage(`${ValidationErrorMessages.RANGE} (3 - 20)`),
  body('accountNumber').exists().withMessage(ValidationErrorMessages.REQUIRED),
  body('expirationDate')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/g)
    .withMessage('Field does not match MM-YY format')
    .custom(isCardDateInTheFutureValidationRule)
    .withMessage('Field date has expired'),
  validateResult,
];

// [POST] /api/v1/users/verify-email
export const verifyEmailValidation = [
  body('email')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isEmail()
    .withMessage(ValidationErrorMessages.EMAIL)
    .custom(isExistingUsernameValidationRule),
  validateResult,
];

// [POST] /api/v1/users/login
export const loginValidation = [
  body('username').exists().withMessage(ValidationErrorMessages.REQUIRED),
  body('password').exists().withMessage(ValidationErrorMessages.REQUIRED),
  validateResult,
];
