const jwt = require('jsonwebtoken');

/**
 * JWT token generation and verification service.
 */
class AuthService {
  /**
   * Generate an access token (short-lived).
   * @param {string} userId
   * @returns {string}
   */
  static generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    });
  }

  /**
   * Generate a refresh token (long-lived).
   * @param {string} userId
   * @returns {string}
   */
  static generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });
  }

  /**
   * Generate both access and refresh tokens.
   * @param {string} userId
   * @returns {{ accessToken: string, refreshToken: string }}
   */
  static generateTokenPair(userId) {
    return {
      accessToken: AuthService.generateAccessToken(userId),
      refreshToken: AuthService.generateRefreshToken(userId),
    };
  }

  /**
   * Verify a JWT token.
   * @param {string} token
   * @param {string} secret
   * @returns {object} Decoded payload
   */
  static verifyToken(token, secret) {
    return jwt.verify(token, secret);
  }
}

module.exports = AuthService;
