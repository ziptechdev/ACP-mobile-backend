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
  'firstName',
  'lastName',
  'username',
  'password',
  'phoneNumber',
  'socialSecurityNumber',
];

export const kycRegisterBankAccountWhiteListedParams = [
  'bankName',
  'bankNumber',
  'accountHolderName',
  'accountNumber',
  'expirationDate',
];
