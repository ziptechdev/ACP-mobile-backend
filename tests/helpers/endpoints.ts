import { eligibleUser } from './mocks/users/eligibleUser';

export const rootUrl = '/api/v1';
export const eligibilityCheckUrl = `${rootUrl}/national-verifier/eligibility-check`;

export const eligibilityRegisterUrl = `${rootUrl}/users/eligibility-register/${eligibleUser.eligibilityCheckId}`;
