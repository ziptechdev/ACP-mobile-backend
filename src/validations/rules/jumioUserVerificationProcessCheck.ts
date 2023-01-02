import { CustomValidator } from 'express-validator';
import {
  getUserJumioVerificationProcess,
  getVerificationProcessStatus,
} from '../../services/api/jumio.service';
import { VerificationProcessStatus } from '../../shared/types/jumoTypes/verificationProcessStatus';

export const jumioUserVerificationProcessCheck: CustomValidator = async (
  value,
  { req }
) => {
  const validationProcess = await getUserJumioVerificationProcess({
    username: req.body.username,
  });

  if (!validationProcess) {
    return;
  }

  if (validationProcess.status === 'PASSED') {
    return Promise.reject('User has been verified');
  }

  if (validationProcess.status === 'PENDING') {
    const verificationProcessStatus: VerificationProcessStatus =
      await getVerificationProcessStatus(
        validationProcess.accountId,
        validationProcess.workflowExecutionId,
        validationProcess.token
      );

    if (verificationProcessStatus.status === 'PASSED') {
      await validationProcess.$query().patch({
        status: 'PASSED',
      });

      return Promise.reject('User has been verified');
    }

    if (['EXPIRED', 'REJECTED'].includes(verificationProcessStatus.status)) {
      await validationProcess.$query().delete();
    } else {
      return Promise.reject('User verification process is pending');
    }
  }
};
