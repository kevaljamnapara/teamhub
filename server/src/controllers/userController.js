const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Update current user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res) => {
  const allowedUpdates = ['name', 'bio', 'avatar'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw ApiError.badRequest('No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  ApiResponse.ok(res, 'Profile updated successfully', { user: user.toJSON() });
});

/**
 * @desc    Get all users (for member search/invite)
 * @route   GET /api/users
 * @access  Private
 */
const getUsers = catchAsync(async (req, res) => {
  const { search, limit = 20 } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .select('name email avatar bio role status')
    .limit(parseInt(limit, 10))
    .sort({ name: 1 });

  ApiResponse.ok(
    res,
    'Users retrieved',
    users.map((u) => u.toJSON())
  );
});

/**
 * @desc    Get a user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'name email avatar bio role status createdAt'
  );

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.ok(res, 'User retrieved', user.toJSON());
});

module.exports = {
  updateProfile,
  getUsers,
  getUserById,
};
