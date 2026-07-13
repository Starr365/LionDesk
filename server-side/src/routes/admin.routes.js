import { Router } from 'express';
import {
  getStaffList,
  createStaff,
  toggleUserActive,
  resetUserPassword,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getRegistryList,
  getReportsData
} from '../controllers/admin.controller.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = Router();

// Apply auth and admin role requirements to all sub-routes
router.use(auth, roleGuard('admin'));

// Staff specialist endpoints
router.get('/staff', getStaffList);
router.post('/staff', createStaff);

// User status/passwords endpoints
router.patch('/users/:id/toggle-active', toggleUserActive);
router.post('/users/:id/reset-password', resetUserPassword);

// Categories endpoints
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Student registry verification endpoints
router.get('/registry', getRegistryList);

// Reports analytics
router.get('/reports', getReportsData);

export default router;
