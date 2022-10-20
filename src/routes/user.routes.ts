import { Router } from 'express';
import { eligibilityRegister } from '../controllers/user.controller';
import { eligibilityRegisterValidation } from '../validations/user.validation';

const router = Router();

router.post(
  '/eligibility-register/:eligibilityCheckId',
  eligibilityRegisterValidation,
  eligibilityRegister
);

export default router;
