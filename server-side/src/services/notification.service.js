import { pool } from '../config/db.js';

/**
 * Notification service: creates in-app notification records.
 * Email dispatch via Resend will be added when the API key is configured.
 */

/**
 * Create an in-app notification for a specific user.
 *
 * @param {object} params
 * @param {number} params.userId - Target user ID.
 * @param {string} params.type - ENUM: confirmation | status_update | escalation | reminder | reopen
 * @param {string} params.title - Notification title.
 * @param {string} [params.message] - Optional longer message body.
 * @param {number} [params.ticketId] - Optional related ticket ID.
 */
export const createNotification = async ({ userId, type, title, message = null, ticketId = null }) => {
  const [result] = await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, ticket_id)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, message, ticketId]
  );

  return { id: result.insertId, userId, type, title, message, ticketId };
};

/**
 * Notify all users with a specific role.
 * Useful for broadcasting escalation alerts to all admins.
 */
export const notifyByRole = async ({ role, type, title, message = null, ticketId = null }) => {
  const [users] = await pool.query(
    `SELECT id FROM users WHERE role = ? AND is_active = TRUE`,
    [role]
  );

  const notifications = [];
  for (const user of users) {
    const notif = await createNotification({ userId: user.id, type, title, message, ticketId });
    notifications.push(notif);
  }

  return notifications;
};

/**
 * Get all notifications for a user, most recent first.
 */
export const getUserNotifications = async (userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
  const [result] = await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`,
    [notificationId, userId]
  );
  return result.affectedRows > 0;
};
