import { Router } from 'express';
import { getMyProfile } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/me', auth, getMyProfile);

export default router;
