import { RegisterEligibleUserParams, RegisterKycUserParams } from './params';
import User from '../../../models/User';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;

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

export const registerKycUser = async (
  trx: Transaction,
  params: RegisterKycUserParams
): Promise<User> => User.query(trx).insert(params);
