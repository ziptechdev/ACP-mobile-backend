import request from 'supertest';
import { server, app } from '../../../src';
import {
  migrateDb,
  rollbackDb,
  seedDb,
  unseedDb,
  eligibilityCheckUrl,
} from '../../helpers/index';
import httpStatus = require('http-status');
import {
  eligibilityCheckReqBody,
  eligibilityCheckSuccessResponsePendingCert,
} from '../../helpers/mocks';
import User from '../../../src/models/User';
import { eligibilityCheckSuccessResponseMock } from '../../../src/shared/mocks/nationalVerifier/eligibilityCheckMocks';
import { eligibleUser } from '../../helpers/mocks/users/eligibleUser';
import { getUsersCount } from '../../../src/services/db/users.service';

describe('/eligibility-check POST', () => {
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

  // 1. Success response tests
  // TODO refactor tests when real api is called

  test('should return success http status', async () => {
    await request(app)
      .post(eligibilityCheckUrl)
      .send(eligibilityCheckReqBody)
      .expect(httpStatus.OK);
  });

  test('should return correct response body', async () => {
    const res = await request(app)
      .post(eligibilityCheckUrl)
      .send(eligibilityCheckReqBody)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    expect(res.body).toEqual(eligibilityCheckSuccessResponsePendingCert);
  });

  test('should successfully create eligible user and set all fields correctly', async () => {
    const res = await request(app)
      .post(eligibilityCheckUrl)
      .send(eligibilityCheckReqBody)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    const user = await User.query().findOne({
      eligibilityCheckId:
        eligibilityCheckSuccessResponseMock.eligibilityCheckId,
    });
    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBe(eligibilityCheckReqBody.firstName);
    expect(user.lastName).toBe(eligibilityCheckReqBody.lastName);
    expect(user.socialSecurityNumber).toBe(
      eligibilityCheckReqBody.socialSecurityNumber
    );
    expect(user.phoneNumber).toBe(eligibilityCheckReqBody.phoneNumber);
    expect(user.applicationId).toBe(
      eligibilityCheckSuccessResponseMock.applicationId
    );
    expect(user.eligibilityCheckStatus).toBe(
      eligibilityCheckSuccessResponseMock.status
    );
    expect(user.lastName).toBe(eligibilityCheckReqBody.lastName);
    expect(user.username).toBeNull();
    expect(user.password).toBeNull();
    expect(user.kycStatus).toBeNull();
  });

  test('should not create new eligible user when there already is user with returned eligibility check id', async () => {
    // TODO possible to do only when real nv api is called so appropriate response can be mocked
  });

  test('should successfully whitelist params', async () => {
    const res = await request(app)
      .post(eligibilityCheckUrl)
      .send({
        ...eligibilityCheckReqBody,
        username: 'username',
        password: 'password',
        kycStatus: 'status',
        createdAt: 'invalid',
      })
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    const user = await User.query().findOne({
      eligibilityCheckId:
        eligibilityCheckSuccessResponseMock.eligibilityCheckId,
    });
    expect(user.username).toBeNull();
    expect(user.password).toBeNull();
    expect(user.kycStatus).toBeNull();
  });
});
