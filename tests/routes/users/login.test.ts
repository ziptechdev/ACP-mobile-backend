import { app, server } from '../../../src';
import request from 'supertest';
import {
  assertErrorResponseWhenBodyKeyIsMissing,
  loginUrl,
  migrateDb,
  rollbackDb,
  seedDb,
  unseedDb,
} from '../../helpers';
import { ErrorTypes } from '../../../src/config/constants';
import httpStatus = require('http-status');
import {
  invalidUserRequestBody,
  loginRequestBody,
} from '../../helpers/mocks/users/login';
import { authUserSerializedFields } from '../../../src/serializers/users/serializedFields';

describe('/login', () => {
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
      .post(loginUrl)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when username is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      loginUrl,
      loginRequestBody,
      'username'
    );
  });

  test('should throw error when password is missing', async () => {
    await assertErrorResponseWhenBodyKeyIsMissing(
      loginUrl,
      loginRequestBody,
      'password'
    );
  });

  test('should throw error on invalid username and password', async () => {
    await request(app)
      .post(loginUrl)
      .send(invalidUserRequestBody)
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should successfully login user and serialize all fields correctly', async () => {
    const res = await request(app)
      .post(loginUrl)
      .send(loginRequestBody)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    expect(res.body.message).toBeDefined();
    expect(res.body.data).toBeDefined();
    expect(res.body.statusCode).toBeDefined();
    expect(Object.keys(res.body.data).sort()).toEqual(
      authUserSerializedFields.sort()
    );
  });
});
