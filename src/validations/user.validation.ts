import { body, param } from 'express-validator';

import { validateResult } from './validateResult';

export const getUserValidator = [
  param('id').exists().isNumeric(),
  validateResult,
];

export const updateUserPasswordValidator = [
  body('password').exists().isLength({ min: 6 }).isLength({ max: 40 }),
  validateResult,
];
