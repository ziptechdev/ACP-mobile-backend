import { body, check } from 'express-validator';
import { validateResult } from './validateResult';
import { NextFunction, Request, Response } from 'express';
import { FileFilterCallback } from 'multer';
import sharp, { Metadata } from 'sharp';
import { jumioUserVerificationProcessCheck } from './rules/jumioUserVerificationProcessCheck';
import { parseFileBufferFromRequest } from '../utils/file';

const multer = require('multer');
const upload = multer({
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
  ) => {
    //return cb(new Error('test nesto'),false);
    if (file.mimetype !== 'image/jpeg') {
      // Reject the file if it is not a JPEG image
      return cb(new Error('Invalid image type'), false);
    }

    if (file.size > 5 * 1024 * 1024) {
      return cb(new Error('Invalid image size'), false);
    }

    return cb(null, true);
  },
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
    .isEmail()
    .custom(jumioUserVerificationProcessCheck),
  check('userIp').exists(),
  check('userState').exists(),
  check('consentOptained')
    .exists()
    .isString()
    .matches(/^(yes|no|na)$/),
  check('consentOptainedAt').exists(),
  validateResult,
];

//[POST] /api/v1/jumio/callback
export const jumioCallbackValidation = [
  body('callbackSentAt').exists(),
  body('workflowExecution').exists(),
  body('workflowExecution.id').exists(),
  body('workflowExecution.href').exists(),
  body('workflowExecution.definitionKey').exists(),
  body('workflowExecution.status').exists(),
  body('account').exists(),
  body('account.id'),
];
