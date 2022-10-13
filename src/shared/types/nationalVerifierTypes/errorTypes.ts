export type NvError = NvValidationError | NvInternalError;

export interface NvValidationError {
  errorId: string;
  timestamp: string;
  status: string;
  message: string;
  errors: SingleNvError[];
}

export interface NvInternalError {
  errorId: string;
  timestamp: string;
  status: string;
  message: string;
  links: string[];
}

export interface SingleNvError {
  code: string;
  description: string;
  field: string;
}
