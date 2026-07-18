import { getUserNotifications, markAsRead } from '../services/notification.service.js';

/**
 * GET /api/notifications
 * Retrieves all notifications for the authenticated user.
 */
export const getNotifications = async (req, res) => {
  try {
    const list = await getUserNotifications(req.user.id);
    res.json(list);
  } catch (error) {
    console.error('[Notifications] getNotifications error:', error.message);
    res.status(500).json({ error: 'Server error retrieving notifications.' });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marks a notification as read.
 */
export const markNotificationRead = async (req, res) => {
  try {
    const success = await markAsRead(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Notification not found or access denied.' });
    }
    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('[Notifications] markRead error:', error.message);
    res.status(500).json({ error: 'Server error updating notification.' });
  }
};
