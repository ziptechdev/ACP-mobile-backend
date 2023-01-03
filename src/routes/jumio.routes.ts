import { Router } from 'express';
import {
  jumioCallbackValidation,
  jumioIdDocumentsVerification,
} from '../validations/jumio.validation';
import {
  jumioCallback,
  ResidentIdentityVerification,
} from '../controllers/jumio.controller';

const router = Router();

router.post(
  '/resident-identity-verification',
  jumioIdDocumentsVerification,
  ResidentIdentityVerification
);

router.post('/callback', jumioCallbackValidation, jumioCallback);

export default router;
