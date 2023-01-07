import { CustomValidator } from 'express-validator';
import {
  getUserJumioVerificationProcess,
  getVerificationProcessStatus,
} from '../../services/api/jumio.service';
import { VerificationProcessStatus } from '../../shared/types/jumoTypes/verificationProcessStatus';
import { JumioVerificationProcessStatus } from '../../models/JumioVerificationProcessStatus';

export const jumioUserVerificationProcessCheck: CustomValidator = async (
  value,
  { req }
) => {
  const validationProcess = await getUserJumioVerificationProcess({
    userRefference: req.body.username,
  });

  if (!validationProcess) {
    return;
  }

  if (validationProcess.status === JumioVerificationProcessStatus.PASSED) {
    return Promise.reject('User has been verified');
  } else if (
    validationProcess.status === JumioVerificationProcessStatus.PENDING
  ) {
    try {
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
    } catch (error) {
      await validationProcess.$query().delete();
    }
  } else if (
    validationProcess.status === JumioVerificationProcessStatus.REJECTED
  ) {
    await validationProcess.$query().delete();
  }
};
