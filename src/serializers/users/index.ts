import User from '../../models/User';
import {
  authUserSerializedFields,
  eligibleUserSerializedFields,
  kycUserSerializedFields,
  userSerializedFields,
} from './serializedFields';
import _ from 'lodash';

export const serializeEligibleUser = (user: User): Partial<User> => {
  return _.pick(user, eligibleUserSerializedFields);
};

export const serializeKycUser = (user: User): Partial<User> => {
  return _.pick(user, kycUserSerializedFields);
};

export const serializeUser = (user: Partial<User>): Partial<User> => {
  return _.pick(user, userSerializedFields);
};

export const serializeAuthUser = (user: Partial<User>): Partial<User> => {
  return _.pick(user, authUserSerializedFields);
};
