import { RegisterUserBankAccountParams } from './params';
import BankAccount from '../../../models/BankAccount';

export const registerUserBankAccount = async (
  user_id: number,
  params: RegisterUserBankAccountParams
): Promise<BankAccount> => BankAccount.query().insert(params);
