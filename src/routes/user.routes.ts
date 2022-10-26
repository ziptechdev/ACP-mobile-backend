import { Router } from 'express';
import {
  eligibilityRegister,
  kycRegister,
} from '../controllers/user.controller';
import {
  eligibilityRegisterValidation,
  kycRegisterValidation,
} from '../validations/user.validation';

const router = Router();

router.post(
  '/eligibility-register/:eligibilityCheckId',
  eligibilityRegisterValidation,
  eligibilityRegister
);

router.post('/kyc-register', kycRegisterValidation, kycRegister);

export default router;
