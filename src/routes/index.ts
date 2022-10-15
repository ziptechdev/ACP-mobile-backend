import { Router } from 'express';
import nationalVerifierRoutes from './nationalVerifier.routes';

const router = Router();

// Test routes
router.get('/test', (req, res) => {
  res.send('Status OK');
});

router.get('/favicon.ico', (req, res) => res.status(204));

// National Verifier routes
router.use('/national-verifier', nationalVerifierRoutes);

//api v1 main router
export default router.use('/api/v1', router);
