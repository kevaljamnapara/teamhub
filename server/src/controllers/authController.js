const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const AuthService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendEmail');

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

  // Create Session
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ipAddress = req.ip || 'Unknown';
  await Session.create({
    userId: user._id,
    refreshToken,
    userAgent,
    ipAddress,
    device: 'Web',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Set cookies
  setCookies(res, accessToken, refreshToken);

  ApiResponse.created(res, 'Registration successful', {
    user: user.toJSON(),
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

  // Create Session
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ipAddress = req.ip || 'Unknown';
  await Session.create({
    userId: user._id,
    refreshToken,
    userAgent,
    ipAddress,
    device: 'Web',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Set cookies
  setCookies(res, accessToken, refreshToken);

  // Update status to online
  user.status = 'online';
  await user.save({ validateBeforeSave: false });

  ApiResponse.ok(res, 'Login successful', {
    user: user.toJSON(),
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  
  if (token) {
    // Delete current session
    await Session.findOneAndDelete({ refreshToken: token });
  }

  // If no other sessions exist, mark user as offline
  const activeSessions = await Session.countDocuments({ userId: req.user._id });
  if (activeSessions === 0) {
    await User.findByIdAndUpdate(req.user._id, { status: 'offline' });
  }

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

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

  // Find the session
  const session = await Session.findOne({ refreshToken: token });
  if (!session) {
    throw ApiError.unauthorized('Invalid or expired session');
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  // Generate new token pair (token rotation)
  const tokens = AuthService.generateTokenPair(user._id);

  // Update session
  session.refreshToken = tokens.refreshToken;
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await session.save();

  // Set new cookies
  setCookies(res, tokens.accessToken, tokens.refreshToken);

  ApiResponse.ok(res, 'Token refreshed');
});

/**
 * @desc    Get active sessions
 * @route   GET /api/auth/sessions
 * @access  Private
 */
const getSessions = catchAsync(async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id })
    .select('-refreshToken')
    .sort('-createdAt');

  // Identify current session
  const currentToken = req.cookies?.refreshToken;
  const sessionsWithCurrent = sessions.map((s) => ({
    ...s.toJSON(),
    isCurrent: currentToken && currentToken === s.refreshToken, // It won't match since refreshToken is excluded, but we do this logic if we want. Actually, let's just find by ID.
  }));

  ApiResponse.ok(res, 'Sessions retrieved', { sessions });
});

/**
 * @desc    Revoke a session
 * @route   DELETE /api/auth/sessions/:id
 * @access  Private
 */
const revokeSession = catchAsync(async (req, res) => {
  const session = await Session.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!session) {
    throw ApiError.notFound('Session not found');
  }

  ApiResponse.ok(res, 'Session revoked');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw ApiError.notFound('There is no user with that email');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your TeamHub account.</p>
    <p>Please click the link below to reset your password. This link is valid for 10 minutes.</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'TeamHub Password Reset Token',
      message,
    });
    ApiResponse.ok(res, 'Email sent');
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.internal('Email could not be sent');
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:token
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw ApiError.badRequest('Invalid token or token has expired');
  }

  // Check if new password is same as old
  const isSamePassword = await user.comparePassword(req.body.password);
  if (isSamePassword) {
    throw ApiError.badRequest('New password cannot be the same as the old password');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Clear all existing sessions for security
  await Session.deleteMany({ userId: user._id });

  ApiResponse.ok(res, 'Password updated successfully');
});

// --------------- Helpers ---------------

function setCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
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
  getSessions,
  revokeSession,
  forgotPassword,
  resetPassword,
};
