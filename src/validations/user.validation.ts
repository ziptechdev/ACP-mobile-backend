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
