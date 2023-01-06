import { Knex } from 'knex';
import { ELIGIBILITY_CHECK_ID_LENGTH } from '../../../config/constants';
import { EligibilityCheckStatus } from '../../../models/EligibilityCheckStatus';
import { generateHashedValue } from '../../../utils/dataGenerators';

export const seed = async (knex: Knex): Promise<any> => {
  // Inserts seed entries
  return knex('users').insert([
    {
      firstName: 'Eligible',
      lastName: 'Not Registered',
      zipCode: '1234567',
      phoneNumber: '123456789',
      socialSecurityNumber: '111111111',
      eligibilityCheckId: 'a'.repeat(ELIGIBILITY_CHECK_ID_LENGTH),
      applicationId: '12345',
      eligibilityCheckStatus: EligibilityCheckStatus.PENDING_CERT,
    },
    {
      firstName: 'Eligible',
      lastName: 'Registered',
      zipCode: '1234567',
      phoneNumber: '123456789',
      socialSecurityNumber: '222222222',
      eligibilityCheckId: 'b'.repeat(ELIGIBILITY_CHECK_ID_LENGTH),
      applicationId: '67890',
      eligibilityCheckStatus: EligibilityCheckStatus.PENDING_CERT,
      username: 'eligible.registered@example.com',
      password: '$2y$10$oNm.hHn/BGNdR7czd6XMdOoaUg/AAjjHeVIuVmAwzrRrVRF9EXZxe',
    },
    {
      firstName: 'Kyc',
      lastName: 'Registered',
      zipCode: '1234567',
      phoneNumber: '123456789',
      socialSecurityNumber: '333333333',
      username: 'kyc.registered@example.com',
      password: await generateHashedValue('Strongpassword123!'),
    },
  ]);
};
