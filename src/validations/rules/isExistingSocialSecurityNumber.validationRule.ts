import { CustomValidator } from 'express-validator';
import User from '../../models/User';

export const isExistingSocialSecurityNumberValidationRule: CustomValidator =
  value => {
    return User.query()
      .where('social_security_number', '=', value)
      .then(user => {
        if (user.length) {
          return Promise.reject('Social security number is already in use');
        }
      });
  };
