const ActivityLog = require('../models/ActivityLog');

/**
 * Log an activity. Called as a side effect from controllers.
 *
 * @param {object} data - Activity data
 * @param {string} data.user - User ID
 * @param {string} data.userName - User display name (denormalized)
 * @param {string} data.type - Activity type
 * @param {string} data.message - Activity message
 * @param {string} [data.project] - Project ID
 * @param {string} [data.task] - Task ID
 * @returns {object} Created activity log
 */
const logActivity = async (data) => {
  try {
    const activity = await ActivityLog.create(data);
    return activity;
  } catch (error) {
    // Log but don't throw — activity logging is non-critical
    console.error('Failed to log activity:', error.message);
    return null;
  }
};

module.exports = { logActivity };
