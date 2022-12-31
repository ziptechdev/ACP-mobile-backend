import { check } from 'express-validator';
import { isValidJumioIdScanImageValidationRule } from './rules/isValidJumioIdScanImage.validationRule';
import { validateResult } from './validateResult';
import { FileFilterCallback } from 'multer';
import sharp, { Metadata } from 'sharp';
import { jumioUserVerificationProcessCheck } from './rules/jumioUserVerificationProcessCheck';

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
  // check('documentIdFront')
  //     .exists()
  //     .custom(isValidJumioIdScanImageValidationRule),
  // check('documentIdBack')
  //     .exists()
  //     .custom(isValidJumioIdScanImageValidationRule),
  // check('selfie')
  //     .exists()
  //     .custom(isValidJumioIdScanImageValidationRule),
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
