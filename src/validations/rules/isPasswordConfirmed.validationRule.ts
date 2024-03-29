import { CustomValidator } from 'express-validator';

export const isPasswordConfirmedValidationRule: CustomValidator = (
  value,
  { req }
) => {
  return value === req.body.confirmedPassword;
};
