const multer = require('multer');
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../constants');
const ApiError = require('../utils/apiError');

/**
 * Multer configuration: memory storage, file type and size validation.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `File type '${file.mimetype}' is not allowed. Allowed types: JPG, PNG, PDF, DOCX`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = upload;
