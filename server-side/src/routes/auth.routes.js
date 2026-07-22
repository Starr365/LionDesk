import { Router } from 'express';
import { activate, login, forgotPassword, resetPassword, verifyRegistry, logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/verify-registry', verifyRegistry);
router.post('/activate', activate);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

export default router;
