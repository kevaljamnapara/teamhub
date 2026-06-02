const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const ApiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants');

/**
 * @desc    Get dashboard statistics for the current user
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = catchAsync(async (req, res) => {
  // Get all projects the user is part of
  const userProjects = await Project.find({
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  }).distinct('_id');

  // Total projects
  const totalProjects = userProjects.length;

  // Task statistics using aggregation
  const taskStatsResult = await Task.aggregate([
    { $match: { project: { $in: userProjects } } },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.DONE] }, 1, 0] },
        },
        pendingTasks: {
          $sum: {
            $cond: [
              { $in: ['$status', [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS]] },
              1,
              0,
            ],
          },
        },
        blockedTasks: {
          $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.BLOCKED] }, 1, 0] },
        },
      },
    },
  ]);

  const taskStats = taskStatsResult[0] || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    blockedTasks: 0,
  };

  // Tasks by status
  const tasksByStatus = await Task.aggregate([
    { $match: { project: { $in: userProjects } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const statusMap = {};
  tasksByStatus.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  // Tasks by priority
  const tasksByPriority = await Task.aggregate([
    { $match: { project: { $in: userProjects } } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  const priorityMap = {};
  tasksByPriority.forEach((p) => {
    priorityMap[p._id] = p.count;
  });

  // Recent activities (last 25)
  const recentActivities = await ActivityLog.find({
    project: { $in: userProjects },
  })
    .sort({ createdAt: -1 })
    .limit(25);

  ApiResponse.ok(res, 'Dashboard stats retrieved', {
    totalProjects,
    totalTasks: taskStats.totalTasks,
    completedTasks: taskStats.completedTasks,
    pendingTasks: taskStats.pendingTasks,
    blockedTasks: taskStats.blockedTasks,
    tasksByStatus: statusMap,
    tasksByPriority: priorityMap,
    recentActivities: recentActivities.map((a) => a.toJSON()),
  });
});

module.exports = { getStats };
