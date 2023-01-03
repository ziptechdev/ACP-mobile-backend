import { WorkflowAccount, WorkflowExecutionStatus } from './sharedTypes';

export interface JumioCallbackParameters {
  callbackSentAt: string;
  workflowExecution: {
    id: string;
    href: string;
    definitionKey: '3';
    status: WorkflowExecutionStatus;
  };
  account: WorkflowAccount;
}
