const User = require('../models/User');
const AuthService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate tokens
  const { accessToken, refreshToken } = AuthService.generateTokenPair(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // Store access token in localStorage via response (frontend expects this)
  ApiResponse.created(res, 'Registration successful', {
    user: user.toJSON(),
    token: accessToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field included
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = AuthService.generateTokenPair(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token cookie
  setRefreshTokenCookie(res, refreshToken);

  // Update status to online
  user.status = 'online';
  await user.save({ validateBeforeSave: false });

  ApiResponse.ok(res, 'Login successful', {
    user: user.toJSON(),
    token: accessToken,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res) => {
  // Clear refresh token from DB
  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: null,
    status: 'offline',
  });

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  ApiResponse.ok(res, 'Logged out successfully');
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.ok(res, 'User retrieved', { user: user.toJSON() });
});

/**
 * @desc    Refresh access token using refresh token cookie
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  // Verify refresh token
  const decoded = AuthService.verifyToken(token, process.env.JWT_REFRESH_SECRET);

  // Find user with matching refresh token
  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  // Generate new token pair (token rotation)
  const tokens = AuthService.generateTokenPair(user._id);

  // Update refresh token in DB
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set new refresh token cookie
  setRefreshTokenCookie(res, tokens.refreshToken);

  ApiResponse.ok(res, 'Token refreshed', {
    token: tokens.accessToken,
  });
});

// --------------- Helpers ---------------

/**
 * Set refresh token as an httpOnly cookie.
 */
function setRefreshTokenCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshToken,
};
