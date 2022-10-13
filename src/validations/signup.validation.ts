import { body } from 'express-validator';
import { validateResult } from './validateResult';

export const signupUserValidator = [
  body('username').exists().isEmail(),
  body('password').exists().isLength({ min: 6 }).isLength({ max: 40 }),
  validateResult,
];
