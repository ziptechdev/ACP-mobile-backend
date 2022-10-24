export interface EligibilityRegisterBody {
  user: EligibilityRegisterParams;
}

export interface EligibilityRegisterParams {
  username: string;
  password: string;
}

export interface CreateEligibleUserParams {
  firstName: string;
  lastName: string;
  middleName?: string;
  zipCode?: string;
  address?: string;
  city?: string;
  state?: string;
  phoneNumber: string;
  dateOfBirth?: string;
  socialSecurityNumber: string;
  eligibilityCheckId: string;
  applicationId: string;
  eligibilityCheckStatus: string;
}

export interface KYCRegisterBody {
  user: KYCRegisterParams;
  bank_account: BankAccountParams;
}

export interface KYCRegisterParams {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirmed_password: string;
  phone_number: number;
  social_security_number: number;
}

export interface BankAccountParams {
  bank_name: string;
  bank_number: string;
  account_holder_name: string;
  account_number: string;
  expiration_date: string;
}
