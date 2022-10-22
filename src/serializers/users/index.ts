import User from '../../models/User';
import { eligibleUserSerializedFields } from './serializedFields';
import _ from 'lodash';

export const serializeEligibleUser = (user: User): Partial<User> => {
  return _.pick(user, eligibleUserSerializedFields);
};
