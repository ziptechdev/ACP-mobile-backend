import { RegisterEligibleUserParams } from './params';
import User from '../../../models/User';

export const registerEligibleUser = async (
  eligibilityCheckId: string,
  params: RegisterEligibleUserParams
): Promise<User> => {
  const eligibleUser = await User.query()
    .findOne({
      eligibilityCheckId,
    })
    .throwIfNotFound();
  return eligibleUser.$query().patchAndFetch(params);
};
