import cron from 'node-cron';
import { pool } from '../config/db.js';
import { createNotification, notifyByRole } from './notification.service.js';
import { emitTicketEscalated, emitNotification } from './socket.service.js';

/**
 * Escalation cron job (PRD Section 2.3).
 * Runs every 30 minutes and escalates tickets that have exceeded
 * their category's escalation_hours threshold.
 */
export const startEscalationCron = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Escalation] Running escalation check...');

    try {
      // Find tickets that should be escalated
      const [tickets] = await pool.query(
        `SELECT t.id, t.ticket_ref, t.student_id, t.staff_id, t.created_at,
                c.escalation_hours, c.name AS category_name
         FROM tickets t
         JOIN categories c ON t.category_id = c.id
         WHERE t.status IN ('open', 'in_progress', 'reopened')
           AND TIMESTAMPDIFF(HOUR, t.created_at, NOW()) > c.escalation_hours`
      );

      if (tickets.length === 0) {
        console.log('[Escalation] No tickets to escalate.');
        return;
      }

      for (const ticket of tickets) {
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
          message: `Ticket in "${ticket.category_name}" exceeded ${ticket.escalation_hours}h threshold.`,
          ticketId: ticket.id
        });

        // Emit real-time events
        emitTicketEscalated(ticket.id);
        for (const notif of notifications) {
          emitNotification(notif.userId, notif);
        }

        console.log(`[Escalation] Escalated ticket ${ticket.ticket_ref}`);
      }
    } catch (error) {
      console.error('[Escalation] Cron job error:', error.message);
    }
  });

  console.log('[Escalation] Cron job scheduled (every 30 minutes).');
};
