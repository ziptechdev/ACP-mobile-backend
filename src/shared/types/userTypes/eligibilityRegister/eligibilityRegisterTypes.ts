export interface eligibilityRegisterBody {
  user: EligibilityRegisterParams;
}

export interface EligibilityRegisterParams {
  username: string;
  password: string;
  eligibilityCheckId: string;
}
