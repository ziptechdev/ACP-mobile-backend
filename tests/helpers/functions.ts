import request from 'supertest';
import { app } from '../../src';
import { ErrorTypes } from '../../src/config/constants';
import httpStatus = require('http-status');

export const getStripedObject = (object: object, path: string): object => {
  let data = object;

  path.split('.').forEach(key => {
    if (typeof data[key as keyof object] === 'object') {
      data = data[key as keyof object];
    } else {
      delete data[key as keyof object];
    }
  });

  return object;
};

export const getModifiedObject = <T extends object>(
  object: T,
  path: string,
  newValue: any
): object => {
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
