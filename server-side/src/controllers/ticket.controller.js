import { pool } from '../config/db.js';
import generateTicketRef from '../utils/generateTicketRef.js';
import { validateDescription, isValidTransition } from '../utils/validators.js';
import { assignStaffByCategory, incrementWorkload, decrementWorkload } from '../services/routing.service.js';
import { createNotification } from '../services/notification.service.js';
import { emitTicketCreated, emitTicketStatusChanged, emitTicketCommented, emitTicketReopened, emitTicketReassigned, emitNotification } from '../services/socket.service.js';

/**
 * POST /api/tickets — Student submits a new ticket.
 */
export const createTicket = async (req, res) => {
  try {
    const { title, description, category_id } = req.body;
    const studentId = req.user.id;

    if (!title || !description || !category_id) {
      return res.status(400).json({ error: 'Title, description, and category are required.' });
    }
    if (!validateDescription(description)) {
      return res.status(400).json({ error: 'Description must be between 20 and 2000 characters.' });
    }

    // Verify category exists and is active
    const [cats] = await pool.query(`SELECT id, name FROM categories WHERE id = ? AND is_active = TRUE`, [category_id]);
    if (cats.length === 0) {
      return res.status(400).json({ error: 'Invalid or inactive category.' });
    }

    // Auto-route to staff
    const assignedStaff = await assignStaffByCategory(category_id);
    const staffId = assignedStaff ? assignedStaff.id : null;

    const ticketRef = generateTicketRef();

    const [result] = await pool.query(
      `INSERT INTO tickets (ticket_ref, title, description, category_id, student_id, staff_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ticketRef, title, description, category_id, studentId, staffId]
    );

    // Increment staff workload
    if (staffId) await incrementWorkload(staffId);

    const ticketId = result.insertId;

    // Notifications
    const studentNotif = await createNotification({
      userId: studentId,
      type: 'confirmation',
      title: `Ticket ${ticketRef} submitted`,
      message: `Your complaint "${title}" has been received and assigned.`,
      ticketId
    });
    emitNotification(studentId, studentNotif);

    if (staffId) {
      const staffNotif = await createNotification({
        userId: staffId,
        type: 'status_update',
        title: `New ticket assigned: ${ticketRef}`,
        message: `You have been assigned ticket "${title}".`,
        ticketId
      });
      emitNotification(staffId, staffNotif);
    }

    // Emit real-time
    const ticket = { id: ticketId, ticket_ref: ticketRef, title, category: cats[0].name, status: 'open' };
    emitTicketCreated(ticket, studentId, staffId);

    res.status(201).json({ message: 'Ticket created.', ticket: { id: ticketId, ticket_ref: ticketRef, staff_id: staffId } });
  } catch (error) {
    console.error('[Tickets] Create error:', error.message);
    res.status(500).json({ error: 'Server error creating ticket.' });
  }
};

/**
 * GET /api/tickets/my — Student's own tickets.
 */
export const getMyTickets = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, c.name AS category_name, u.full_name AS staff_name
       FROM tickets t
       JOIN categories c ON t.category_id = c.id
       LEFT JOIN users u ON t.staff_id = u.id
       WHERE t.student_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('[Tickets] getMyTickets error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /api/tickets/assigned — Staff's assigned tickets.
 */
export const getAssignedTickets = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, c.name AS category_name, s.full_name AS student_name, s.email AS student_email, stud.matric_no AS student_matric
       FROM tickets t
       JOIN categories c ON t.category_id = c.id
       JOIN users s ON t.student_id = s.id
       LEFT JOIN students stud ON s.id = stud.user_id
       WHERE t.staff_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('[Tickets] getAssignedTickets error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /api/tickets — Admin: all tickets with optional filters.
 */
export const getAllTickets = async (req, res) => {
  try {
    const { status, category_id } = req.query;
    let query = `SELECT t.*, c.name AS category_name, s.full_name AS student_name, s.email AS student_email, stud.matric_no AS student_matric, st.full_name AS staff_name
                 FROM tickets t
                 JOIN categories c ON t.category_id = c.id
                 JOIN users s ON t.student_id = s.id
                 LEFT JOIN students stud ON s.id = stud.user_id
                 LEFT JOIN users st ON t.staff_id = st.id`;
    const params = [];
    const conditions = [];

    if (status) { conditions.push('t.status = ?'); params.push(status); }
    if (category_id) { conditions.push('t.category_id = ?'); params.push(category_id); }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('[Tickets] getAllTickets error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /api/tickets/:id — Single ticket with comments.
 */
export const getTicketById = async (req, res) => {
  try {
    const [tickets] = await pool.query(
      `SELECT t.*, c.name AS category_name, s.full_name AS student_name, s.email AS student_email, stud.matric_no AS student_matric, st.full_name AS staff_name
       FROM tickets t
       JOIN categories c ON t.category_id = c.id
       JOIN users s ON t.student_id = s.id
       LEFT JOIN students stud ON s.id = stud.user_id
       LEFT JOIN users st ON t.staff_id = st.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

    const [comments] = await pool.query(
      `SELECT tc.*, u.full_name AS author_name, u.role AS author_role
       FROM ticket_comments tc
       JOIN users u ON tc.author_id = u.id
       WHERE tc.ticket_id = ?
       ORDER BY tc.created_at ASC`,
      [req.params.id]
    );

    res.json({ ...tickets[0], comments });
  } catch (error) {
    console.error('[Tickets] getTicketById error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * PATCH /api/tickets/:id/status — Update ticket status (with transition enforcement).
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, resolution_notes } = req.body;
    const ticketId = req.params.id;

    const [tickets] = await pool.query(`SELECT * FROM tickets WHERE id = ?`, [ticketId]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

    const ticket = tickets[0];

    if (!isValidTransition(ticket.status, status)) {
      return res.status(400).json({ error: `Cannot transition from '${ticket.status}' to '${status}'.` });
    }

    if (status === 'resolved' && (!resolution_notes || !resolution_notes.trim())) {
      return res.status(400).json({ error: 'Resolution notes are mandatory when resolving a ticket.' });
    }

    const updates = { status };
    if (status === 'resolved') {
      updates.resolution_notes = resolution_notes;
      updates.resolved_at = new Date();
    }
    if (status === 'closed') {
      updates.closed_at = new Date();
    }

    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE tickets SET ${setClauses} WHERE id = ?`, [...Object.values(updates), ticketId]);

    // Adjust workload when ticket leaves/enters active state
    if (['resolved', 'closed'].includes(status) && ticket.staff_id) {
      await decrementWorkload(ticket.staff_id);
    }

    // Notify student of status change
    const notif = await createNotification({
      userId: ticket.student_id,
      type: 'status_update',
      title: `Ticket ${ticket.ticket_ref} is now ${status}`,
      ticketId: ticket.id
    });
    emitNotification(ticket.student_id, notif);
    emitTicketStatusChanged(ticketId, status, ticket.student_id, ticket.staff_id);

    res.json({ message: `Ticket status updated to '${status}'.` });
  } catch (error) {
    console.error('[Tickets] updateStatus error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * POST /api/tickets/:id/comments — Add a comment.
 */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const ticketId = req.params.id;

    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text is required.' });

    const [tickets] = await pool.query(`SELECT student_id, staff_id FROM tickets WHERE id = ?`, [ticketId]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

    const [result] = await pool.query(
      `INSERT INTO ticket_comments (ticket_id, author_id, text) VALUES (?, ?, ?)`,
      [ticketId, req.user.id, text.trim()]
    );

    const comment = { id: result.insertId, ticket_id: ticketId, author_id: req.user.id, text: text.trim() };
    emitTicketCommented(ticketId, comment, tickets[0].student_id, tickets[0].staff_id);

    res.status(201).json({ message: 'Comment added.', comment });
  } catch (error) {
    console.error('[Tickets] addComment error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * POST /api/tickets/:id/reopen — Student reopens a resolved ticket.
 */
export const reopenTicket = async (req, res) => {
  try {
    const { reason } = req.body;
    const ticketId = req.params.id;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'A reason is mandatory to reopen a ticket.' });
    }

    const [tickets] = await pool.query(`SELECT * FROM tickets WHERE id = ? AND student_id = ?`, [ticketId, req.user.id]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

    if (tickets[0].status !== 'resolved') {
      return res.status(400).json({ error: 'Only resolved tickets can be reopened.' });
    }

    await pool.query(
      `UPDATE tickets SET status = 'reopened', reopen_reason = ? WHERE id = ?`,
      [reason.trim(), ticketId]
    );

    // Re-increment staff workload since ticket is active again
    if (tickets[0].staff_id) await incrementWorkload(tickets[0].staff_id);

    // Notify staff + admins
    if (tickets[0].staff_id) {
      const staffNotif = await createNotification({
        userId: tickets[0].staff_id, type: 'reopen',
        title: `Ticket ${tickets[0].ticket_ref} reopened`,
        message: `Reason: ${reason.trim()}`, ticketId
      });
      emitNotification(tickets[0].staff_id, staffNotif);
    }

    emitTicketReopened(ticketId, tickets[0].staff_id);

    res.json({ message: 'Ticket reopened.' });
  } catch (error) {
    console.error('[Tickets] reopen error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * POST /api/tickets/:id/feedback — Student submits feedback on resolved ticket.
 */
export const submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const ticketId = req.params.id;

    const [tickets] = await pool.query(`SELECT * FROM tickets WHERE id = ? AND student_id = ?`, [ticketId, req.user.id]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

    if (tickets[0].status !== 'resolved') {
      return res.status(400).json({ error: 'Feedback can only be submitted on resolved tickets.' });
    }

    await pool.query(
      `UPDATE tickets SET feedback = ?, status = 'closed', closed_at = NOW() WHERE id = ?`,
      [feedback || 'No feedback provided.', ticketId]
    );

    // Decrement staff workload
    if (tickets[0].staff_id) await decrementWorkload(tickets[0].staff_id);

    emitTicketStatusChanged(ticketId, 'closed', tickets[0].student_id, tickets[0].staff_id);

    res.json({ message: 'Feedback submitted and ticket closed.' });
  } catch (error) {
    console.error('[Tickets] feedback error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * PATCH /api/tickets/:id/assign — Admin reassigns a ticket to a different staff.
 */
export const reassignTicket = async (req, res) => {
  try {
    const { staff_id } = req.body;
    const ticketId = req.params.id;

    if (!staff_id) return res.status(400).json({ error: 'staff_id is required.' });

    const [tickets] = await pool.query(`SELECT * FROM tickets WHERE id = ?`, [ticketId]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket not found.' });

    const [staffUsers] = await pool.query(`SELECT id, full_name FROM users WHERE id = ? AND role = 'staff' AND is_active = TRUE`, [staff_id]);
    if (staffUsers.length === 0) return res.status(400).json({ error: 'Invalid or inactive staff member.' });

    const oldStaffId = tickets[0].staff_id;

    await pool.query(`UPDATE tickets SET staff_id = ? WHERE id = ?`, [staff_id, ticketId]);

    // Adjust workloads
    if (oldStaffId) await decrementWorkload(oldStaffId);
    await incrementWorkload(staff_id);

    // Notify new staff
    const notif = await createNotification({
      userId: staff_id, type: 'status_update',
      title: `Ticket ${tickets[0].ticket_ref} assigned to you`,
      ticketId
    });
    emitNotification(staff_id, notif);
    emitTicketReassigned(ticketId, oldStaffId, staff_id, tickets[0].student_id);

    res.json({ message: 'Ticket reassigned.' });
  } catch (error) {
    console.error('[Tickets] reassign error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};
