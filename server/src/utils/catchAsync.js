/**
 * Wraps an async route handler to catch rejected promises
 * and forward them to Express error handling middleware.
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
