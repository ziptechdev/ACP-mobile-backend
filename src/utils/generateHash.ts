import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config/constants';

export const generateHashedValue = (value: string) => {
  return bcrypt.hash(value, SALT_ROUNDS);
};
