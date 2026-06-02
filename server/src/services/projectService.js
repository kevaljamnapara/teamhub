const Task = require('../models/Task');
const { TASK_STATUS } = require('../constants');

/**
 * Compute task statistics for a project.
 * @param {string} projectId
 * @returns {{ taskCount: number, completedTasks: number, progress: number }}
 */
const getProjectTaskStats = async (projectId) => {
  const [stats] = await Task.aggregate([
    { $match: { project: projectId } },
    {
      $group: {
        _id: null,
        taskCount: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.DONE] }, 1, 0] },
        },
      },
    },
  ]);

  const taskCount = stats?.taskCount || 0;
  const completedTasks = stats?.completedTasks || 0;
  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return { taskCount, completedTasks, progress };
};

/**
 * Enrich a project document with computed task stats.
 * @param {object} project - Project document (lean or toJSON)
 * @returns {object} Project with taskCount, completedTasks, progress
 */
const enrichProjectWithStats = async (project) => {
  const stats = await getProjectTaskStats(project._id || project.id);
  return {
    ...project,
    ...stats,
  };
};

/**
 * Enrich multiple project documents with computed task stats.
 * @param {Array} projects
 * @returns {Array}
 */
const enrichProjectsWithStats = async (projects) => {
  return Promise.all(projects.map(enrichProjectWithStats));
};

module.exports = {
  getProjectTaskStats,
  enrichProjectWithStats,
  enrichProjectsWithStats,
};
