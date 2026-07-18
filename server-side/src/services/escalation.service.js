import cron from 'node-cron';
import { pool } from '../config/db.js';
import { createNotification, notifyByRole } from './notification.service.js';
import { emitTicketEscalated, emitNotification } from './socket.service.js';

/**
 * Calculates the number of business days (Monday to Friday) between two dates.
 */
export const getBusinessDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) return 0;
  
  let count = 0;
  const current = new Date(start);
  
  while (current < end) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) and not Saturday (6)
      count++;
    }
  }
  return count;
};

/**
 * Escalation cron job (PRD Section 2.3).
 * Runs every hour and escalates tickets that have been unresolved for
 * 2 or more business days (excluding weekends).
 */
export const startEscalationCron = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Escalation] Running business days escalation check...');

    try {
      // Find all active tickets
      const [tickets] = await pool.query(
        `SELECT t.id, t.ticket_ref, t.student_id, t.staff_id, t.created_at,
                c.name AS category_name
         FROM tickets t
         JOIN categories c ON t.category_id = c.id
         WHERE t.status IN ('open', 'in_progress', 'reopened')`
      );

      const now = new Date();
      const escalatedTickets = tickets.filter(t => getBusinessDaysDifference(t.created_at, now) >= 2);

      if (escalatedTickets.length === 0) {
        console.log('[Escalation] No tickets reached the 2 business days limit.');
        return;
      }

      for (const ticket of escalatedTickets) {
        // Update status to escalated
        await pool.query(
          `UPDATE tickets SET status = 'escalated', updated_at = NOW() WHERE id = ?`,
          [ticket.id]
        );

        // Notify all admins
        const notifications = await notifyByRole({
          role: 'admin',
          type: 'escalation',
          title: `Ticket ${ticket.ticket_ref} escalated`,
          message: `Ticket in "${ticket.category_name}" has exceeded the 2 business days threshold.`,
          ticketId: ticket.id
        });

        // Emit real-time events
        emitTicketEscalated(ticket.id);
        for (const notif of notifications) {
          emitNotification(notif.userId, notif);
        }

        console.log(`[Escalation] Escalated ticket ${ticket.ticket_ref} after 2 business days.`);
      }
    } catch (error) {
      console.error('[Escalation] Cron job error:', error.message);
    }
  });

  console.log('[Escalation] Cron job scheduled (hourly check for 2 business days limit).');
};
