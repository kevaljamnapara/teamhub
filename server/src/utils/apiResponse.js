/**
 * Standardized API response helpers.
 * All responses follow the format: { success, message, data }
 */
class ApiResponse {
  /**
   * Send a success response.
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {*} data
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    const response = { success: true, message };
    if (data !== null && data !== undefined) {
      response.data = data;
    }
    return res.status(statusCode).json(response);
  }

  static created(res, message = 'Created successfully', data = null) {
    return ApiResponse.success(res, 201, message, data);
  }

  static ok(res, message = 'Success', data = null) {
    return ApiResponse.success(res, 200, message, data);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Send an error response.
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {Array} errors
   */
  static error(res, statusCode = 500, message = 'Error', errors = []) {
    const response = { success: false, message };
    if (errors.length > 0) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
