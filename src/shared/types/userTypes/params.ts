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
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmedPassword: string;
  phoneNumber: string;
  socialSecurityNumber: string;
  bankName: string;
  bankNumber: string;
  accountHolderName: string;
  accountNumber: string;
  expirationDate: string;
}

export interface KYCRegisterParams {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmedPassword: string;
  phoneNumber: string;
  socialSecurityNumber: string;
}

export interface BankAccountParams {
  bankName: string;
  bankNumber: string;
  accountHolderName: string;
  accountNumber: string;
  expirationDate: string;
}

export interface EmailVerificationParams {
  email: string;
}

export interface LoginParams {
  username: string;
  password: string;
}
