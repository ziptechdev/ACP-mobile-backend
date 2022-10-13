import { Router } from 'express';
import { eligibilityCheck } from '../controllers/nationalVerifier.controller';

const router = Router();

router.post('/eligibility-check', eligibilityCheck);

export default router;
