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
