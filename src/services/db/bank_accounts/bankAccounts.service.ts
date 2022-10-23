import { RegisterUserBankAccountParams } from './params';
import User from '../../../models/User';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;
import { Model } from 'objection';

export const registerUserBankAccount = async (
  trx: Transaction,
  user: User,
  params: RegisterUserBankAccountParams
): Promise<Model> => {
  return user.$relatedQuery('bank_account', trx).insert(params);
};
