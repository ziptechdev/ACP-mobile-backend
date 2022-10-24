import { BankAccountParams } from '../../shared/types/userTypes/params';
import User from '../../models/User';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;
import { Model } from 'objection';

export const registerUserBankAccount = async (
  trx: Transaction,
  user: User,
  params: BankAccountParams
): Promise<Model> => {
  return user.$relatedQuery('bankAccount', trx).insert(params);
};
