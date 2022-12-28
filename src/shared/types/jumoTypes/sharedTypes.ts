export type WorkflowExecutionAllowedChannel = 'WEB' | 'API' | 'SDK';

export type WorkflowStatus =
  | 'INITIATED'
  | 'ACQUIRED'
  | 'PROCESSED'
  | 'SESSION_EXPIRED'
  | 'TOKEN_EXPIRED';

export type WorkflowCredentialCategory =
  | 'ID'
  | 'FACEMAP'
  | 'DOCUMENT'
  | 'SELFIE';

export type WorkflowDecisionLabel =
  | {
      type: 'NOT_EXECUTED';
      details: { label: 'TECHNICAL_ERROR' | 'NOT_UPLOADED' };
    }
  | { type: 'PASSED'; details: { label: 'OK' } }
  | {
      type: 'REJECTED';
      details: {
        label:
          | 'BAD_QUALITY'
          | 'BLACK_WHITE'
          | 'MISSING_PAGE'
          | 'MISSING_SIGNATURE'
          | 'NOT_A_DOCUMENT'
          | 'PHOTOCOPY';
      };
    }
  | {
      type: 'WARNING';
      details: {
        label:
          | 'DOCUMENT_EXPIRY_WITHIN_CONFIGURED_LIMIT'
          | 'LIVENESS_UNDETERMINED'
          | 'UNSUPPORTED_COUNTRY'
          | 'UNSUPPORTED_DOCUMENT_TYPE';
      };
    };

export type WorkflowCredentialPartsClassifier = 'FRONT' | 'BACK' | 'FACE';

export type WorkflowExecutionStatus =
  | 'PROCESSED'
  | 'KYX_SESSION_EXPIRED'
  | 'KYX_TOKEN_EXPIRED';

export interface IdAndIndentityVerification {
  key: 3;
  credentials: Array<{
    category: 'ID';
    type: {
      values: ['DRIVING_LICENSE', 'ID_CARD', 'PASSPORT'];
    };
    country: {
      values: ['USA'];
    };
  }>;
}

export interface UserConsent {
  userIp: string;
  userLocation: {
    country: string;
    state: string;
  };
  consent: {
    obtained: string;
    obtainedAt: string;
  };
}

export interface WorkflowExecutionCredential {
  id: string;
  category: 'ID' | 'FACEMAP' | 'SELFIE';
  allowedChannels?: Array<WorkflowExecutionAllowedChannel>;
  api?: {
    token: string;
    parts: {
      front?: 'string';
      back?: 'string';
      face?: 'string';
    };
    workflowExecution: 'string';
  };
}

export interface WorkflowAccount {
  id: string;
  href?: string;
}

export interface WorkflowExecution {
  id: string;
  credentials?: Array<WorkflowExecutionCredential>;
}

export interface WorkflowApiCredential {
  token: string;
  parts: {
    front?: 'string';
    back?: 'string';
    face?: 'string';
  };
  workflowExecution: 'string';
}

export interface WorkflowDetailCredential {
  id: string;
  category: WorkflowCredentialCategory;
  parts?: Array<WorkflowCredentialPart>;
}

export interface WorkflowCredentialPart {
  classifier: WorkflowCredentialPartsClassifier;
  href: string;
}

export interface WorkflowCapabilityType {
  id: string;
  credentials: Array<WorkflowExecutionCredential>;
  decision: WorkflowDecisionLabel;
  data: {
    type: 'JUMIO_STANDARD';
    predictedAge: number;
    ageConfidenceRange: string;
  };
}
