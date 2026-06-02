const ActivityLog = require('../models/ActivityLog');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get recent activities across all user's projects
 * @route   GET /api/activities
 * @access  Private
 */
const getActivities = catchAsync(async (req, res) => {
  const { page = 1, limit = 25 } = req.query;

  // Get all projects the user is part of
  const userProjects = await Project.find({
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  }).distinct('_id');

  const filter = { project: { $in: userProjects } };

  const activities = await ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
    .limit(parseInt(limit, 10));

  const total = await ActivityLog.countDocuments(filter);

  ApiResponse.ok(res, 'Activities retrieved', {
    activities: activities.map((a) => a.toJSON()),
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

/**
 * @desc    Get activities for a specific project
 * @route   GET /api/activities/project/:projectId
 * @access  Private
 */
const getProjectActivities = catchAsync(async (req, res) => {
  const { page = 1, limit = 25 } = req.query;

  const activities = await ActivityLog.find({ project: req.params.projectId })
    .sort({ createdAt: -1 })
    .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
    .limit(parseInt(limit, 10));

  const total = await ActivityLog.countDocuments({ project: req.params.projectId });

  ApiResponse.ok(res, 'Project activities retrieved', {
    activities: activities.map((a) => a.toJSON()),
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

module.exports = {
  getActivities,
  getProjectActivities,
};
