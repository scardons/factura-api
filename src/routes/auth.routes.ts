import { Router } from 'express';
import { getAuthUrl, handleCallback } from '../controllers/auth.controller';

const router = Router();

router.get('/authorize', getAuthUrl);
router.get('/callback', handleCallback);

export default router;
