import request from 'supertest';
import { server, app } from '../../../src';
import {
  migrateDb,
  rollbackDb,
  seedDb,
  unseedDb,
  eligibilityRegisterUrl,
} from '../../helpers/index';
import httpStatus = require('http-status');
import { ErrorTypes } from '../../../src/config/constants';

describe('/eligibility-register POST', () => {
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

  // 1. Error response tests

  test('should throw error when body is missing', async () => {
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when password is missing', async () => {
    const body = {
      username: 'email@email.com',
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when username is missing', async () => {
    const body = {
      password: 'test',
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when eligibility check ID is not in correct format', async () => {
    const body = {
      username: 'email@email.com',
      password: 'test',
    };
    const res = await request(app)
      .post('/api/v1/users/eligibility-register/1234')
      .send(body)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when username is not in correct format', async () => {
    const body = {
      username: 'non valid email',
      password: 'test',
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when password is too short', async () => {
    const body = {
      username: 'email@email.com',
      password: 'test',
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  /*test('should throw error when username already exists', async () => {
    const body = {
      username: 'orhanljubuncic@gmail.com',
      password: 'password!',
    };
    const res = await request(app).post('/signup').send(body).expect(409);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.UNIQUE_VIOLATION_ERROR);
  });*/
});
