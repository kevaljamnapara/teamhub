const Task = require('../models/Task');
const Comment = require('../models/Comment');

/**
 * Get a task with its comments embedded (matching frontend shape).
 * @param {string} taskId
 * @returns {object} Task with comments array
 */
const getTaskWithComments = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  const comments = await Comment.find({ task: taskId })
    .sort({ createdAt: 1 });

  const taskJSON = task.toJSON();
  taskJSON.comments = comments.map((c) => c.toJSON());

  return taskJSON;
};

/**
 * Get all tasks with their comments embedded.
 * @param {object} filter - Mongoose filter
 * @param {object} sort - Mongoose sort
 * @returns {Array}
 */
const getTasksWithComments = async (filter = {}, sort = { createdAt: -1 }) => {
  const tasks = await Task.find(filter).sort(sort);
  const taskIds = tasks.map((t) => t._id);

  // Batch load all comments for these tasks
  const comments = await Comment.find({ task: { $in: taskIds } })
    .sort({ createdAt: 1 });

  // Group comments by task ID
  const commentsByTask = {};
  comments.forEach((c) => {
    const taskId = c.task.toString();
    if (!commentsByTask[taskId]) {
      commentsByTask[taskId] = [];
    }
    commentsByTask[taskId].push(c.toJSON());
  });

  // Attach comments to each task
  return tasks.map((task) => {
    const taskJSON = task.toJSON();
    taskJSON.comments = commentsByTask[task._id.toString()] || [];
    return taskJSON;
  });
};

module.exports = {
  getTaskWithComments,
  getTasksWithComments,
};
