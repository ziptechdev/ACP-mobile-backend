import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config/constants';

export const generateHashedValue = (value: string) => {
  return bcrypt.hash(value, SALT_ROUNDS);
};

export const generateRandomDigit = (length: number) => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};
