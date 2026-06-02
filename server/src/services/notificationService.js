const Notification = require('../models/Notification');

/**
 * Create a notification and emit it via Socket.io.
 * This is a shared service called from controllers as a side effect.
 *
 * @param {object} data - Notification data
 * @param {string} data.receiver - User ID of the receiver
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} [data.userId] - User ID who triggered the notification
 * @param {string} [data.link] - Navigation link
 * @returns {object} Created notification
 */
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);

    // Emit via Socket.io (lazy import to avoid circular deps)
    const { emitToUser } = require('../sockets');
    emitToUser(data.receiver.toString(), 'notificationCreated', notification.toJSON());

    return notification;
  } catch (error) {
    // Log but don't throw — notifications are non-critical side effects
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

module.exports = { createNotification };
