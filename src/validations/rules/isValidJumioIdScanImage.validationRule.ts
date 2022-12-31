import { CustomValidator } from 'express-validator';
const sizeOf = require('image-size');

export const isValidJumioIdScanImageValidationRule: CustomValidator = value => {
  //Check the MIME type of the image
  if (!value || !value.mimetype || !value.size || !value.path) {
    return Promise.reject('Invalid value provided');
  }

  if (!value.mimetype.match(/^image\/(jpeg|png)$/)) {
    return Promise.reject('Image should be JPEG or PNG');
  }

  // Check the size of the image
  if (value.size > 5000000) {
    return Promise.reject('Please select an image file that is less than 5MB');
  }

  // Check the dimensions of the image
  const dimensions = sizeOf(value.path);
  if (dimensions.width > 8000 || dimensions.height > 8000) {
    return Promise.reject(
      'Please select an image file with dimensions of 8000x8000 or smaller'
    );
  }
};
