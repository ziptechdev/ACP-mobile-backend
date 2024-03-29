// *************ERROR TYPES*************

export enum ErrorTypes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  UNIQUE_VIOLATION_ERROR = 'UNIQUE_VIOLATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  DB_ERROR = 'DB_ERROR',
  NO_ENDPOINT_ERROR = 'NO_ENDPOINT_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NV_VALIDATION_ERROR = 'NV_VALIDATION_ERROR',
  NV_INTERNAL_ERROR = 'NV_INTERNAL_ERROR',
  SERVICE_ERROR = 'SERVICE_ERROR',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
}

export const SALT_ROUNDS = 10;

export const ELIGIBILITY_CHECK_ID_LENGTH = 64;
