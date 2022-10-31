import { testDatabase } from '../../src/database';
import request from 'supertest';
import { app } from '../../src';
import { ErrorTypes } from '../../src/config/constants';
import httpStatus = require('http-status');

export const migrateDb = (): Promise<void> => {
  return testDatabase.migrate.latest();
};

export const rollbackDb = async (): Promise<void> => {
  await testDatabase.migrate.rollback();
  return testDatabase.destroy();
};

export const seedDb = (): Promise<[string[]]> => {
  return testDatabase.seed.run();
};

export const unseedDb = async (): Promise<void> => {
  await testDatabase.schema.raw(
    'TRUNCATE bank_accounts RESTART IDENTITY CASCADE'
  );
  await testDatabase.schema.raw('TRUNCATE users RESTART IDENTITY CASCADE');
};

export const destroyDb = (): Promise<void> => {
  return testDatabase.destroy();
};

export const getStripedObject = <T extends object>(
  object: T,
  path: string
): T => {
  let data = object as any;

  path.split('.').forEach(key => {
    if (typeof data[key as keyof T] === 'object') {
      data = data[key as keyof T];
    } else {
      delete data[key as keyof T];
    }
  });

  return object;
};

export const getModifiedObject = <T extends object>(
  object: T,
  path: string,
  newValue: any
): T => {
  let data = object as any;

  path.split('.').forEach(key => {
    if (typeof data[key as keyof T] === 'object') {
      data = data[key as keyof T];
    } else {
      data[key as keyof T] = newValue;
    }
  });

  return object;
};

export const assertErrorResponseWhenBodyKeyIsMissing = async (
  url: string,
  requestBody: object,
  path: string
) => {
  const res = await request(app)
    .post(url)
    .send(getStripedObject(requestBody, path))
    .expect(httpStatus.UNPROCESSABLE_ENTITY);
  expect(res.body.error).toBeDefined();
  expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
};

export const assertErrorResponseWhenBodyValueDoesNotMatchValidation = async <
  T extends object
>(
  url: string,
  requestBody: T,
  path: string,
  newValue: any
) => {
  const res = await request(app)
    .post(url)
    .send(getModifiedObject(requestBody, path, newValue))
    .expect(httpStatus.UNPROCESSABLE_ENTITY);
  expect(res.body.error).toBeDefined();
  expect(res.body.error.type).toEqual(ErrorTypes.VALIDATION_ERROR);
};

export * from './endpoints';
