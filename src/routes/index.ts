import { Router } from 'express';

const router = Router();

// Test routes
router.get('/test', (req, res) => {
  res.send('Status OK');
});

router.get('/favicon.ico', (req, res) => res.status(204));

//api v1 main router
export default router;
