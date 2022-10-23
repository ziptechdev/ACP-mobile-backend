import {
  CreateEligibleUserParams,
  EligibilityRegisterParams,
} from '../../shared/types/userTypes/params';
import User from '../../models/User';

export const getUsersCount = async (): Promise<number> => {
  return (await User.query().count())[0].count;
};

export const registerEligibleUser = async (
  eligibilityCheckId: string,
  params: EligibilityRegisterParams
): Promise<User> => {
  const eligibleUser = await User.query()
    .findOne({
      eligibilityCheckId,
    })
    .throwIfNotFound();
  return eligibleUser.$query().patchAndFetch(params);
};

// finds or creates user that has passed eligibility check and is pending to be registered(get username and password)
export const findOrCreateEligibleUser = async (
  params: CreateEligibleUserParams
): Promise<User> => {
  const eligibleUser = await User.query().findOne({
    eligibilityCheckId: params.eligibilityCheckId,
  });
  return eligibleUser || User.query().insert(params);
};
