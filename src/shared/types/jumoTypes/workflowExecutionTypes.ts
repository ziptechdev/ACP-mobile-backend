import {
  WorkflowAccount,
  WorkflowApiCredential,
  WorkflowExecution,
} from './sharedTypes';

export interface WorkflowExecutionPayload {
  file: File;
}

export interface WorkflowExecutionResponse {
  timestamp: string;
  account: WorkflowAccount;
  workflowExecution: WorkflowExecution;
  api?: WorkflowApiCredential;
}
