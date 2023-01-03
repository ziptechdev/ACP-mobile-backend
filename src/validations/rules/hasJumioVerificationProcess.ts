import { CustomValidator } from 'express-validator';
import { getUserJumioVerificationProcess } from '../../services/api/jumio.service';

export const hasJumioVerificationProcess: CustomValidator = async (
  value,
  { req }
) => {
  const validationProcess = await getUserJumioVerificationProcess({
    userRefference: value,
    workflowExecutionId: req.params.workflowExecutionId,
    accountId: req.params.accountId,
  });

  if (!validationProcess) {
    return Promise.reject('Missing user verification process');
  }
};
