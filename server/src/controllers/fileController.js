const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Upload a file to Cloudinary
 * @route   POST /api/files/upload
 * @access  Private
 */
const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file provided');
  }

  // Determine resource type based on mimetype
  const isImage = req.file.mimetype.startsWith('image/');
  const resourceType = isImage ? 'image' : 'raw';

  // Upload to Cloudinary using stream
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'teamhub',
        resource_type: resourceType,
        // For images, add transformations
        ...(isImage && {
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  });

  ApiResponse.created(res, 'File uploaded successfully', {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    size: result.bytes,
    originalName: req.file.originalname,
    resourceType: result.resource_type,
  });
});

module.exports = { uploadFile };
