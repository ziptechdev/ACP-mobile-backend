export const eligibilityCheckReqBody = {
  firstName: 'John',
  middleName: 'Mark',
  lastName: 'Doe',
  address: 'Drive 10',
  state: 'Texas',
  city: 'Dallas',
  zipCode: '123456789',
  dob: '1990-12-01',
  eligibilityProgramCode: 'E1, E2, E3',
  consentInd: 'Y',
  ssn4: '1234',
};

export const eligibilityCheckSuccessResponsePendingCert = {
  eligibilityCheckId: '12224332423423f3245234ertjlnmv3',
  applicationId: 'SDFBGD3',
  status: 'PENDING_CERT',
  _links: {
    certification: {
      href: 'carrierUrl.com',
    },
  },
};
