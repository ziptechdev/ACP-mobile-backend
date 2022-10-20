import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config/constants';

export const generateHashPassword = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};
