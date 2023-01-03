import {
  IdAndIndentityVerification,
  WorkflowAccount,
  UserConsent,
  WorkflowExecution,
} from './sharedTypes';

export interface jumioAccountPayload {
  customerInternalReference: string;
  workflowDefinition: IdAndIndentityVerification;
  userReference: string;
  callbackUrl: string;
  userConsent: UserConsent;
}

export interface jumioAccountSuccessResponse {
  timestamp: string;
  account: WorkflowAccount;
  sdk: {
    token: string;
  };
  workflowExecution: WorkflowExecution;
}
