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
    expect(res.body).toEqual(eligibilityCheckSuccessResponsePendingCert);
  });
});
