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
 * Escalation cron job (Chapter 3 / PRD Section 2.3).
 * Runs every hour and escalates open/in-progress/reopened tickets whose
 * elapsed time exceeds their category's configured escalation_hours.
 */
export const startEscalationCron = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Escalation] Running category-based escalation check...');

    try {
      // Find all active tickets whose age exceeds their category's escalation_hours
      const [overdueTickets] = await pool.query(
        `SELECT t.id, t.ticket_ref, t.student_id, t.staff_id, t.created_at,
                c.name AS category_name, c.escalation_hours,
                TIMESTAMPDIFF(HOUR, t.created_at, NOW()) AS elapsed_hours
         FROM tickets t
         JOIN categories c ON t.category_id = c.id
         WHERE t.status IN ('open', 'in_progress', 'reopened')
           AND TIMESTAMPDIFF(HOUR, t.created_at, NOW()) >= c.escalation_hours`
      );

      if (overdueTickets.length === 0) {
        console.log('[Escalation] No tickets exceeded their category escalation threshold.');
        return;
      }

      for (const ticket of overdueTickets) {
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
          message: `Ticket "${ticket.ticket_ref}" in "${ticket.category_name}" has exceeded the ${ticket.escalation_hours}h escalation threshold (${ticket.elapsed_hours}h elapsed).`,
          ticketId: ticket.id
        });

        // Emit real-time events
        emitTicketEscalated(ticket.id);
        for (const notif of notifications) {
          emitNotification(notif.userId, notif);
        }

        console.log(`[Escalation] Escalated ticket ${ticket.ticket_ref} (Category: ${ticket.category_name}, Threshold: ${ticket.escalation_hours}h, Elapsed: ${ticket.elapsed_hours}h).`);
      }
    } catch (error) {
      console.error('[Escalation] Cron job error:', error.message);
    }
  });

  console.log('[Escalation] Cron job scheduled (hourly check for per-category escalation_hours).');
};
