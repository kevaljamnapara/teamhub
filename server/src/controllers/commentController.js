const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { createNotification } = require('../services/notificationService');
const { logActivity } = require('../services/activityService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { NOTIFICATION_TYPE, ACTIVITY_TYPE } = require('../constants');

/**
 * @desc    Add a comment to a task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
const addComment = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  // Check project membership
  const project = await Project.findById(task.project);
  if (!project || !project.isMember(req.user._id)) {
    throw ApiError.forbidden('You do not have access to this task');
  }

  const comment = await Comment.create({
    task: task._id,
    author: req.user._id,
    text: req.body.text,
  });

  // Log activity
  await logActivity({
    user: req.user._id,
    userName: req.user.name,
    type: ACTIVITY_TYPE.COMMENT_ADDED,
    message: `commented on "${task.title}"`,
    project: task.project,
    task: task._id,
  });

  // Notify task assignee (if different from commenter)
  if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
    await createNotification({
      receiver: task.assignee,
      type: NOTIFICATION_TYPE.COMMENT_ADDED,
      title: 'New Comment',
      message: `${req.user.name} commented on "${task.title}"`,
      userId: req.user._id,
      link: '/tasks',
    });
  }

  ApiResponse.created(res, 'Comment added', comment.toJSON());
});

/**
 * @desc    Get all comments for a task
 * @route   GET /api/tasks/:id/comments
 * @access  Private
 */
const getComments = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  const comments = await Comment.find({ task: req.params.id })
    .sort({ createdAt: 1 });

  ApiResponse.ok(
    res,
    'Comments retrieved',
    comments.map((c) => c.toJSON())
  );
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Author or Project Admin)
 */
const deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }

  // Only author or project admin can delete
  if (comment.author.toString() !== req.user._id.toString()) {
    const task = await Task.findById(comment.task);
    const project = task ? await Project.findById(task.project) : null;

    if (!project || !project.isAdminOrOwner(req.user._id)) {
      throw ApiError.forbidden('You can only delete your own comments');
    }
  }

  await Comment.findByIdAndDelete(req.params.id);

  ApiResponse.ok(res, 'Comment deleted successfully');
});

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
