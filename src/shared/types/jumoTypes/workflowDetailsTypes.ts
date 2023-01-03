import {
  WorkflowAccount,
  WorkflowCapabilityType,
  WorkflowDetailCredential,
  WorkflowStatus,
} from './sharedTypes';

export interface WorkflowDetails {
  workflow: {
    id: string;
    status: WorkflowStatus;
    definitionKey: '3';
    userReference: string;
    customerInternalReference: string;
  };
  account: WorkflowAccount;
  createdAt: string;
  startedAt: string;
  completedAt: string;
  credentials: Array<WorkflowDetailCredential>;
  capabilities: {
    extraction: Array<WorkflowCapabilityType>;
    similarity: Array<WorkflowCapabilityType>;
    liveness?: Array<WorkflowCapabilityType>;
    dataChecks: Array<WorkflowCapabilityType>;
    imageChecks: Array<WorkflowCapabilityType>;
    usability: Array<WorkflowCapabilityType>;
  };
}
