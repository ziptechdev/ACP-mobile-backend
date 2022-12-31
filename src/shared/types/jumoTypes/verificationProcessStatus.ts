import { VerificationProccessRejectedReasson } from './sharedTypes';

export interface VerificationProcessStatus {
  status: 'PASSED' | 'REJECTED' | 'EXPIRED' | 'PENDING';
  reasons?: Array<VerificationProccessRejectedReasson>;
}
