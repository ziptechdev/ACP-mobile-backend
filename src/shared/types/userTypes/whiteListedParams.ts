export const eligibilityRegisterWhiteListedParams = ['username', 'password'];

export const createEligibleUserWhiteListedParams = [
  'firstName',
  'lastName',
  'middleName',
  'zipCode',
  'address',
  'city',
  'state',
  'phoneNumber',
  'dateOfBirth',
  'socialSecurityNumber',
  'eligibilityCheckId',
  'applicationId',
  'eligibilityCheckStatus',
];

export const kycRegisterUserWhiteListedParams = [
  'first_name',
  'last_name',
  'username',
  'password',
  'phone_number',
  'social_security_number',
];

export const kycRegisterBankAccountWhiteListedParams = [
  'bank_name',
  'bank_number',
  'account_holder_name',
  'account_number',
  'expiration_date',
];
