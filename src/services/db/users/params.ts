export interface RegisterEligibleUserParams {
  username: string;
  password: string;
}

export interface RegisterKycUserParams {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirmed_password: string;
  social_security_number: number;
}
