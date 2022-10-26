import { CustomValidator } from 'express-validator';
import { isInTheFuture, formatCardExpirationDate } from '../../utils/date';

export const isCardDateInTheFutureValidationRule: CustomValidator = value => {
  return isInTheFuture(new Date(formatCardExpirationDate(value)));
};
