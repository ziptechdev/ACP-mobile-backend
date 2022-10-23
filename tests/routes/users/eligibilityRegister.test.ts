import request from 'supertest';
import { server, app } from '../../../src';
import {
  migrateDb,
  rollbackDb,
  seedDb,
  unseedDb,
  eligibilityRegisterUrl,
  rootUrl,
} from '../../helpers/index';
import httpStatus = require('http-status');
import {
  ELIGIBILITY_CHECK_ID_LENGTH,
  ErrorTypes,
} from '../../../src/config/constants';
import { eligibleUser } from '../../helpers/mocks/users/eligibleUser';
import { eligibleUserSerializedFields } from '../../../src/serializers/users/serializedFields';
import User from '../../../src/models/User';

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
      user: {
        username: 'email@email.com',
      },
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
      user: {
        password: 'test',
      },
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
      user: {
        username: 'email@email.com',
        password: 'test',
      },
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
      user: {
        username: 'non valid email',
        password: 'test',
      },
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
      user: {
        username: 'email@email.com',
        password: 'test',
      },
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
  });

  test('should throw error when username already exists', async () => {
    const body = {
      user: {
        username: 'eligible.registered@example.com',
        password: 'password!',
      },
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.CONFLICT);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.UNIQUE_VIOLATION_ERROR);
  });

  test('should throw error when eligibility check id does not exist', async () => {
    const body = {
      user: {
        username: 'email@email.com',
        password: 'password!',
      },
    };
    const res = await request(app)
      .post(
        `${rootUrl}/users/eligibility-register/${'z'.repeat(
          ELIGIBILITY_CHECK_ID_LENGTH
        )}`
      )
      .send(body)
      .expect(httpStatus.NOT_FOUND);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.type).toEqual(ErrorTypes.NOT_FOUND_ERROR);
  });

  // 2. Success response tests

  test('should successfully register eligible user and serialize all fields correctly', async () => {
    const body = {
      user: {
        username: 'email@email.com',
        password: 'password!',
      },
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    expect(Object.keys(res.body).sort()).toEqual(
      eligibleUserSerializedFields.sort()
    );
  });

  test('should successfully register eligible user and have all fields set correctly', async () => {
    const body = {
      user: {
        username: 'email@email.com',
        password: 'password!',
      },
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    expect(res.body.username).toBe(body.user.username);
  });

  test('should successfully whitelist params', async () => {
    const body = {
      user: {
        id: 20,
        eligibilityCheckId: 'b'.repeat(ELIGIBILITY_CHECK_ID_LENGTH),
        username: 'email@email.com',
        password: 'password',
      },
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();
    expect(res.body.id).not.toBe(body.user.id);
    expect(res.body.id).not.toBe(body.user.eligibilityCheckId);
  });

  test('should successfully register eligible user with correctly set username and hashed password', async () => {
    const body = {
      user: {
        username: 'email@email.com',
        password: 'password!',
      },
    };
    const res = await request(app)
      .post(eligibilityRegisterUrl)
      .send(body)
      .expect(httpStatus.OK);
    expect(res.body.error).toBeUndefined();

    const user = await User.query().findOne({
      eligibilityCheckId: eligibleUser.eligibilityCheckId,
    });
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(res.body.id);
    expect(user.username).toBe(body.user.username);
    expect(user.password.length).toBeGreaterThan(body.user.password.length);
  });
});
