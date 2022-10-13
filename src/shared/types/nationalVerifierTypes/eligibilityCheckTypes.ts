export interface eligibilityCheckPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  urbanizationCode?: string;
  dob: string;
  ssn4?: string;
  tribalId?: string;
  bqpFirstName?: string;
  bqpLastName?: string;
  bqpDob?: string;
  bqpSsn4?: string;
  bqpTribalId?: string;
  alternateId?: string;
  bqpAlternateId?: string;
  eligibilityProgramCode: string;
  consentInd: 'Y' | 'N';
  contactPhoneNumber?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactCity?: string;
  contactState?: string;
  contactZipCode?: string;
  contactUrbCode?: string;
  repId?: string;
  repNotAssisted?: string;
  carrierUrl?: string;
}

export interface eligibilityCheckSuccessResponsePendingCert {
  eligibilityCheckId: string;
  applicationId: string;
  status: 'PENDING_CERT';
  _links: {
    certification: {
      href: string;
    };
  };
}

export interface eligibilityCheckSuccessResponsePendingResolution {
  eligibilityCheckId: string;
  applicationId: string;
  failures?: string[];
  status: 'PENDING_RESOLUTION';
  eligibilityExpirationDate: string;
  lastManualReviewTime: string;
  numberofManualReview: string;
  rejections: { [key: string]: string }[];
  _links: {
    resolution: {
      href: 'https://api.universalservice.org/ebca-svc/security/getPage?token={eligibilityCheckId)&id={idnumber)';
    };
  };
}
