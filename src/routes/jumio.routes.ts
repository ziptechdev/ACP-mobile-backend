import { Router } from 'express';
import { jumioIdDocumentsVerification } from '../validations/jumio.validation';
import { ResidentIdentityVerification } from '../controllers/jumio.controller';

const router = Router();

router.post(
  '/resident-identity-verification',
  jumioIdDocumentsVerification,
  ResidentIdentityVerification
);

export default router;
