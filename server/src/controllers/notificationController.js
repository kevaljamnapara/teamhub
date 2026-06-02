const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get notifications for the current user
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;

  const filter = { receiver: req.user._id };
  if (unreadOnly === 'true') {
    filter.read = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
    .limit(parseInt(limit, 10));

  const total = await Notification.countDocuments(filter);

  ApiResponse.ok(res, 'Notifications retrieved', {
    notifications: notifications.map((n) => n.toJSON()),
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    receiver: req.user._id,
  });

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  notification.read = true;
  await notification.save();

  ApiResponse.ok(res, 'Notification marked as read', notification.toJSON());
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { receiver: req.user._id, read: false },
    { read: true }
  );

  ApiResponse.ok(res, 'All notifications marked as read');
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
