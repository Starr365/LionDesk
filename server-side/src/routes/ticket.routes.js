import { Router } from 'express';
import {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  addComment,
  reopenTicket,
  submitFeedback,
  reassignTicket
} from '../controllers/ticket.controller.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Student routes
router.post('/', roleGuard('student'), createTicket);
router.get('/my', roleGuard('student'), getMyTickets);
router.post('/:id/reopen', roleGuard('student'), reopenTicket);
router.post('/:id/feedback', roleGuard('student'), submitFeedback);

// Staff routes
router.get('/assigned', roleGuard('staff'), getAssignedTickets);

// HOD / Admin routes
router.get('/', roleGuard('admin'), getAllTickets);
router.patch('/:id/assign', roleGuard('admin'), reassignTicket);

// Shared routes (Student, Staff, Admin)
router.get('/:id', getTicketById);
router.patch('/:id/status', updateTicketStatus);
router.post('/:id/comments', addComment);

export default router;
