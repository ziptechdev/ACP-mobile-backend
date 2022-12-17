export const userSerializedFields = [
  'id',
  'username',
  'firstName',
  'middleName',
  'lastName',
  'phoneNumber',
];

export const eligibleUserSerializedFields = [
  ...userSerializedFields,
  'eligibilityCheckId',
  'applicationId',
  'eligibilityCheckStatus',
]; // add more fields if necessary

export const kycUserSerializedFields = [...userSerializedFields]; // TODO: add kyc id doc and selfie pic

export const authUserSerializedFields = [...userSerializedFields, 'token'];
