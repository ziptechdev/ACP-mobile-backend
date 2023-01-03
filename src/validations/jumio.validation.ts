import { body, check } from 'express-validator';
import { validateResult } from './validateResult';
import { FileFilterCallback } from 'multer';
import sharp, { Metadata } from 'sharp';
import { jumioUserVerificationProcessCheck } from './rules/jumioUserVerificationProcessCheck';
import { parseFileBufferFromRequest } from '../utils/file';
import { HttpError } from '../utils/httpError';
import { ErrorTypes } from '../config/constants';
import { ValidationErrorMessages } from '../models/ValidationErrorMessages';

const multer = require('multer');
const upload = multer({
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
  ) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return cb(
        new HttpError(
          422,
          `Invalid image type: ${file.mimetype}`,
          ErrorTypes.VALIDATION_ERROR
        ),
        false
      );
    }

    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// [POST] /api/v1/jumio/resident-identity-verification
export const jumioIdDocumentsVerification = [
  upload.fields([
    { name: 'documentIdFront' },
    { name: 'documentIdBack' },
    { name: 'selfie' },
  ]),
  check('username')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isEmail()
    .withMessage(ValidationErrorMessages.EMAIL)
    .custom(jumioUserVerificationProcessCheck),
  check('userIp').exists().withMessage(ValidationErrorMessages.REQUIRED),
  check('userState').exists().withMessage(ValidationErrorMessages.REQUIRED),
  check('consentOptained')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED)
    .isString()
    .withMessage(ValidationErrorMessages.STRING)
    .matches(/^(yes|no|na)$/)
    .withMessage('Posible values: yes, no, na'),
  check('consentOptainedAt')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  validateResult,
];

//[POST] /api/v1/jumio/callback
export const jumioCallbackValidation = [
  body('callbackSentAt').exists().withMessage(ValidationErrorMessages.REQUIRED),
  body('workflowExecution')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  body('workflowExecution.id')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  body('workflowExecution.href')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  body('workflowExecution.definitionKey')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  body('workflowExecution.status')
    .exists()
    .withMessage(ValidationErrorMessages.REQUIRED),
  body('account').exists().withMessage(ValidationErrorMessages.REQUIRED),
  body('account.id').exists().withMessage(ValidationErrorMessages.REQUIRED),
  validateResult,
];
