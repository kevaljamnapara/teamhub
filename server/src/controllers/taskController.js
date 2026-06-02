const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { getTaskWithComments, getTasksWithComments } = require('../services/taskService');
const { createNotification } = require('../services/notificationService');
const { logActivity } = require('../services/activityService');
const { emitToProject, emitToUser } = require('../sockets');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { NOTIFICATION_TYPE, ACTIVITY_TYPE, TASK_STATUS } = require('../constants');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = catchAsync(async (req, res) => {
  const { title, description, projectId, assigneeId, priority, status, dueDate } = req.body;

  // Verify project exists and user is a member
  const project = await Project.findById(projectId);
  if (!project) {
    throw ApiError.notFound('Project not found');
  }
  if (!project.isMember(req.user._id)) {
    throw ApiError.forbidden('You are not a member of this project');
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignee: assigneeId || null,
    priority,
    status,
    dueDate,
  });

  // Log activity
  await logActivity({
    user: req.user._id,
    userName: req.user.name,
    type: ACTIVITY_TYPE.TASK_CREATED,
    message: `created task "${title}"`,
    project: projectId,
    task: task._id,
  });

  // Notify assignee if assigned
  if (assigneeId && assigneeId !== req.user._id.toString()) {
    await createNotification({
      receiver: assigneeId,
      type: NOTIFICATION_TYPE.TASK_ASSIGNED,
      title: 'New Task Assigned',
      message: `You have been assigned to "${title}"`,
      userId: req.user._id,
      link: '/tasks',
    });

    // Real-time socket event
    emitToUser(assigneeId, 'taskAssigned', task.toJSON());
  }

  // Emit to project room
  emitToProject(projectId, 'taskUpdated', task.toJSON());

  const taskWithComments = await getTaskWithComments(task._id);
  ApiResponse.created(res, 'Task created successfully', taskWithComments);
});

/**
 * @desc    Get all tasks (with filters)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = catchAsync(async (req, res) => {
  const { projectId, status, priority, assigneeId, search, sortBy, sortOrder } = req.query;

  // Build filter
  const filter = {};

  if (projectId) {
    filter.project = projectId;
  } else {
    // Only show tasks from projects the user is a member of
    const userProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).distinct('_id');
    filter.project = { $in: userProjects };
  }

  if (status && status !== 'all') filter.status = status;
  if (priority && priority !== 'all') filter.priority = priority;
  if (assigneeId && assigneeId !== 'all') filter.assignee = assigneeId;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const tasks = await getTasksWithComments(filter, sort);

  ApiResponse.ok(res, 'Tasks retrieved', tasks);
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = catchAsync(async (req, res) => {
  const task = await getTaskWithComments(req.params.id);

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  ApiResponse.ok(res, 'Task retrieved', task);
});

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = catchAsync(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  // Check project membership
  const project = await Project.findById(task.project);
  if (!project || !project.isMember(req.user._id)) {
    throw ApiError.forbidden('You do not have access to this task');
  }

  const previousStatus = task.status;
  const previousAssignee = task.assignee?.toString();

  // Map frontend field names to model field names
  const updates = {};
  const allowedUpdates = {
    title: 'title',
    description: 'description',
    assigneeId: 'assignee',
    priority: 'priority',
    status: 'status',
    dueDate: 'dueDate',
  };

  Object.entries(allowedUpdates).forEach(([bodyField, modelField]) => {
    if (req.body[bodyField] !== undefined) {
      updates[modelField] = req.body[bodyField];
    }
  });

  task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  // Log status change activity
  if (updates.status && updates.status !== previousStatus) {
    const activityType =
      updates.status === TASK_STATUS.DONE
        ? ACTIVITY_TYPE.TASK_COMPLETED
        : ACTIVITY_TYPE.TASK_STATUS_CHANGED;

    const statusLabel = updates.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    await logActivity({
      user: req.user._id,
      userName: req.user.name,
      type: activityType,
      message:
        activityType === ACTIVITY_TYPE.TASK_COMPLETED
          ? `completed task "${task.title}"`
          : `moved "${task.title}" to ${statusLabel}`,
      project: task.project,
      task: task._id,
    });
  }

  // Notify new assignee
  if (
    updates.assignee &&
    updates.assignee !== previousAssignee &&
    updates.assignee !== req.user._id.toString()
  ) {
    await createNotification({
      receiver: updates.assignee,
      type: NOTIFICATION_TYPE.TASK_ASSIGNED,
      title: 'Task Assigned',
      message: `You have been assigned to "${task.title}"`,
      userId: req.user._id,
      link: '/tasks',
    });

    // Log assignment activity
    await logActivity({
      user: req.user._id,
      userName: req.user.name,
      type: ACTIVITY_TYPE.TASK_ASSIGNED,
      message: `assigned "${task.title}"`,
      project: task.project,
      task: task._id,
    });

    emitToUser(updates.assignee, 'taskAssigned', task.toJSON());
  }

  // Emit update to project room
  emitToProject(task.project.toString(), 'taskUpdated', task.toJSON());

  const taskWithComments = await getTaskWithComments(task._id);
  ApiResponse.ok(res, 'Task updated successfully', taskWithComments);
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  // Check project membership — only owner/admin can delete
  const project = await Project.findById(task.project);
  if (!project || !project.isAdminOrOwner(req.user._id)) {
    throw ApiError.forbidden('Only project owner or admin can delete tasks');
  }

  // Delete comments for this task
  await Comment.deleteMany({ task: task._id });
  await Task.findByIdAndDelete(req.params.id);

  // Emit to project room
  emitToProject(task.project.toString(), 'taskUpdated', { id: task._id, deleted: true });

  ApiResponse.ok(res, 'Task deleted successfully');
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
