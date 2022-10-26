import { CustomValidator } from 'express-validator';
import User from '../../models/User';

export const isExistingUsernameValidationRule: CustomValidator = value => {
  return User.query()
    .where('username', '=', value)
    .then(user => {
      if (user.length) {
        return Promise.reject('Username is already in use');
      }
    });
};
