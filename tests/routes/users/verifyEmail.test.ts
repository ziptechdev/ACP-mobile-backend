import { app, server } from '../../../src';
import request from 'supertest';
import {
  assertErrorResponseWhenBodyKeyIsMissing,
  verifyEmailUrl,
} from '../../helpers';
import { ErrorTypes } from '../../../src/config/constants';
import httpStatus = require('http-status');
import {
  emailBody,
  verifyEmailRequestBody,
} from '../../helpers/mocks/users/verifyEmail';
import { sendTestEmail } from '../../../src/mailer';
const { mock } = require('nodemailer-mock');

describe('/verify-email POST', () => {
  afterAll(async () => {
    await server.close();
  });

  test('should throw error when body is missing', async () => {
    const res = await request(app)
      .post(verifyEmailUrl)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when email is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      verifyEmailUrl,
      verifyEmailRequestBody,
      'email'
    );
  });

  test('should send email and respond with verification code', async () => {
    await sendTestEmail(emailBody);

    const sentEmails = mock.getSentMail();

    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].from).toBe(emailBody.from);
    expect(sentEmails[0].to).toBe(emailBody.to);
    expect(sentEmails[0].subject).toBe(emailBody.subject);
    expect(sentEmails[0].html).toBe(emailBody.html);
  });
});
