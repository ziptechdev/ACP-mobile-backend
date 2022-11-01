import { Router } from 'express';
import {
  eligibilityRegister,
  kycRegister,
  verifyEmail,
} from '../controllers/user.controller';
import {
  eligibilityRegisterValidation,
  kycRegisterValidation,
  verifyEmailValidation,
} from '../validations/user.validation';

const router = Router();

router.post(
  '/eligibility-register/:eligibilityCheckId',
  eligibilityRegisterValidation,
  eligibilityRegister
);

router.post('/kyc-register', kycRegisterValidation, kycRegister);
router.post('/verify-email', verifyEmailValidation, verifyEmail);

export default router;
