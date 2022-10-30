import {
  kycRegisterUrl,
  migrateDb,
  rollbackDb,
  seedDb,
  unseedDb,
} from '../../helpers';
import { app, server } from '../../../src';
import request from 'supertest';
import { ErrorTypes } from '../../../src/config/constants';
import httpStatus = require('http-status');
import {
  assertErrorResponseWhenBodyKeyIsMissing,
  assertErrorResponseWhenBodyValueDoesNotMatchValidation,
} from '../../helpers/functions';
import { kycRegisterRequestBody } from '../../helpers/mocks/users/kycVerifiedUser';
import { kycUserSerializedFields } from '../../../src/serializers/users/serializedFields';

describe('/kyc-register POST', () => {
  beforeAll(() => {
    return migrateDb();
  });

  beforeEach(async () => {
    return seedDb();
  });

  afterEach(() => {
    return unseedDb();
  });

  afterAll(async () => {
    await server.close();
    return rollbackDb();
  });

  test('should throw error when body is missing', async () => {
    const res = await request(app)
      .post(kycRegisterUrl)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when first name is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.firstName'
    );
  });

  test('should throw error when last name is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.lastName'
    );
  });

  test('should throw error when username is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.username'
    );
  });

  test('should throw error when username is not an email', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.username',
      'invalidEmail'
    );
  });

  test('should throw error when username is not unique', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.username',
      'kyc.registered@example.com'
    );
  });

  test('should throw error when password is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.password'
    );
  });

  test('should throw error when confirmed password is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.confirmedPassword'
    );
  });

  test('should throw error when password is not strong', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.password',
      'iamweak'
    );
  });

  test('should throw error when confirmed password does not match', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.confirmedPassword',
      'missmatch'
    );
  });

  test('should throw error when social security number is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.socialSecurityNumber'
    );
  });

  test('should throw error when social security number has invalid format', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.socialSecurityNumber',
      '111-223333'
    );
  });

  test('should throw error when social security number is not unique', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'user.socialSecurityNumber',
      '444-55-6666'
    );
  });

  test('should throw error when bank name is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'bankAccount.bankName'
    );
  });

  test('should throw error when bank number is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'bankAccount.bankNumber'
    );
  });

  test('should throw error when bank account expiration date is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'bankAccount.expirationDate'
    );
  });

  test('should throw error when bank account expiration date has invalid format', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'bankAccount.expirationDate',
      '99/99'
    );
  });

  test('should throw error when bank account expiration date is not in the future', async () => {
    await assertErrorResponseWhenBodyValueDoesNotMatchValidation(
      kycRegisterUrl,
      kycRegisterRequestBody,
      'bankAccount.expirationDate',
      '01/22'
    );
  });

  test('should successfully register kyc verified user and serialize all fields correctly', async () => {
    const res = await request(app)
      .post(kycRegisterUrl)
      .send(kycRegisterRequestBody)
      .expect(httpStatus.CREATED);
    expect(res.body.error).toBeUndefined();
    expect(res.body.message).toBeDefined();
    expect(res.body.data).toBeDefined();
    expect(res.body.statusCode).toBeDefined();
    expect(Object.keys(res.body.data).sort()).toEqual(
      kycUserSerializedFields.sort()
    );
  });

  test('should sucessfully whitelist params', async () => {
    const user = Object.assign({ id: 55 }, kycRegisterRequestBody.user);
    const body = {
      user,
      bankAccount: kycRegisterRequestBody.bankAccount,
    };
    const res = await request(app)
      .post(kycRegisterUrl)
      .send(body)
      .expect(httpStatus.CREATED);
    expect(res.body.error).toBeUndefined();
    expect(res.body.id).not.toBe(body.user.id);
  });
});
