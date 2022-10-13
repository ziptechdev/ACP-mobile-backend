import { body } from 'express-validator';
import { validateResult } from './validateResult';

export const loginValidator = [
  body('username').exists(),
  body('password').exists(),
  validateResult,
];
