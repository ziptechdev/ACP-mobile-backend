import { NvError } from '../shared/types/nationalVerifierTypes';
import { ErrorTypes } from '../config/constants';

export enum NvErrorStatuses {
  'BAD_REQUEST' = 'BAD_REQUEST',
  'INTERNAL_SERVER_ERROR' = 'INTERNAL_SERVER_ERROR',
}

export const labelNvError = (error: NvError) => {
  return {
    ...error,
    errorType:
      error.status === NvErrorStatuses.BAD_REQUEST
        ? ErrorTypes.NV_VALIDATION_ERROR
        : ErrorTypes.NV_INTERNAL_ERROR,
  };
};
