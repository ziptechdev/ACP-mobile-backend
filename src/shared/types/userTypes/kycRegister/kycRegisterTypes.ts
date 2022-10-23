export interface KYCRegisterBody {
  user: KYCRegisterParams;
  bank_account: BankAccount;
}

export interface KYCRegisterParams {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirmed_password: string;
  social_security_number: number;
}

export interface BankAccount {
  bank_name: string;
  bank_number: string;
  account_holder_name: string;
  account_number: string;
  expiration_date: string;
}
