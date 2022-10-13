import { param } from 'express-validator';
import { validateResult } from './validateResult';

export const likeUserValidator = [
  param('id').exists().isNumeric(),
  validateResult,
];

export const unlikeUserValidator = [
  param('id').exists().isNumeric(),
  validateResult,
];
