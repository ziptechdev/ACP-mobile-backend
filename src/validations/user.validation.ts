import { body, param } from 'express-validator';
import { validateResult } from './validateResult';
import { ELIGIBILITY_CHECK_ID_LENGTH } from '../config/constants';

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
  body('user.first_name').exists().isLength({ min: 3, max: 20 }),
  body('user.last_name').exists().isLength({ min: 3, max: 20 }),
  body('user.email').exists().isEmail(),
  body('user.password').exists().isStrongPassword(),
  body('user.confirmed_password').custom(
    (value, { req }) => value === req.body.user.password
  ),
  body('user.social_security_number')
    .exists()
    .matches(/^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/),
  body('user.bank_account').exists(),
  body('user.bank_account.bank_name').exists().isLength({ min: 3, max: 20 }),
  body('user.bank_account.bank_number').exists(),
  body('user.bank_account.account_holder_name')
    .exists()
    .isLength({ min: 3, max: 20 }),
  body('user.bank_account.account_number').exists().isInt(),
  body('user.bank_account.expiration_date')
    .exists()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/g),
  validateResult,
];
