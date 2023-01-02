import { Router } from 'express';
import {
  eligibilityRegister,
  kycRegister,
  login,
  logout,
  refreshToken,
  verifyEmail,
} from '../controllers/user.controller';
import {
  eligibilityRegisterValidation,
  kycRegisterValidation,
  loginValidation,
  verifyEmailValidation,
} from '../validations/user.validation';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/jwt';

const router = Router();

router.post(
  '/eligibility-register/:eligibilityCheckId',
  eligibilityRegisterValidation,
  eligibilityRegister
);

router.post(
  '/kyc-register/account-id/:accountId/workflow-execution-id/:workflowExecutionId',
  kycRegisterValidation,
  kycRegister
);
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/login', loginValidation, login);
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyAccessToken, logout);

export default router;
