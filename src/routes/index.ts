import { Router } from 'express';
import nationalVerifierRoutes from './nationalVerifier.routes';
import userRoutes from './user.routes';

const router = Router();

// Test routes
router.get('/status', (req, res) => {
  res.send('Server is running');
});

router.get('/favicon.ico', (req, res) => res.status(204));

// National Verifier routes
router.use('/national-verifier', nationalVerifierRoutes);

// User routes
router.use('/users', userRoutes);

//api v1 main router
export default router.use('/api/v1', router);
