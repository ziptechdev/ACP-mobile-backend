import { fromEmailAddress } from '../../../../src/config/vars';

export const verifyEmailRequestBody = {
  email: 'john.doe@example.com',
};

export const emailBody = {
  from: fromEmailAddress,
  to: 'test@example.com',
  subject: 'Email verification',
  html: `<h2>12345</h2>`,
};
