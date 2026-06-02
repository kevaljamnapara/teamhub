const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { enrichProjectWithStats, enrichProjectsWithStats } = require('../services/projectService');
const { createNotification } = require('../services/notificationService');
const { logActivity } = require('../services/activityService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { NOTIFICATION_TYPE, ACTIVITY_TYPE } = require('../constants');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = catchAsync(async (req, res) => {
  const { title, description, status, priority, color, dueDate } = req.body;

  const project = await Project.create({
    title,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'admin' }],
    status,
    priority,
    color,
    dueDate,
  });

  // Log activity
  await logActivity({
    user: req.user._id,
    userName: req.user.name,
    type: ACTIVITY_TYPE.PROJECT_CREATED,
    message: `created project "${title}"`,
    project: project._id,
  });

  const enriched = await enrichProjectWithStats(project.toJSON());

  ApiResponse.created(res, 'Project created successfully', enriched);
});

/**
 * @desc    Get all projects for the current user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  }).sort({ createdAt: -1 });

  const projectsJSON = projects.map((p) => p.toJSON());
  const enriched = await enrichProjectsWithStats(projectsJSON);

  ApiResponse.ok(res, 'Projects retrieved', enriched);
});

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  // Check membership
  if (!project.isMember(req.user._id)) {
    throw ApiError.forbidden('You are not a member of this project');
  }

  const enriched = await enrichProjectWithStats(project.toJSON());

  ApiResponse.ok(res, 'Project retrieved', enriched);
});

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private (Owner/Admin)
 */
const updateProject = catchAsync(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (!project.isAdminOrOwner(req.user._id)) {
    throw ApiError.forbidden('Only project owner or admin can update this project');
  }

  const allowedUpdates = ['title', 'description', 'status', 'priority', 'color', 'dueDate'];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  project = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  // Log activity
  await logActivity({
    user: req.user._id,
    userName: req.user.name,
    type: ACTIVITY_TYPE.PROJECT_UPDATED,
    message: `updated project "${project.title}"`,
    project: project._id,
  });

  const enriched = await enrichProjectWithStats(project.toJSON());

  ApiResponse.ok(res, 'Project updated successfully', enriched);
});

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Owner only)
 */
const deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project owner can delete this project');
  }

  // Cascade delete related data
  const taskIds = await Task.find({ project: project._id }).distinct('_id');
  await Comment.deleteMany({ task: { $in: taskIds } });
  await Task.deleteMany({ project: project._id });
  await ActivityLog.deleteMany({ project: project._id });
  await Notification.deleteMany({ link: { $regex: project._id.toString() } });
  await Project.findByIdAndDelete(req.params.id);

  ApiResponse.ok(res, 'Project deleted successfully');
});

/**
 * @desc    Add a member to a project
 * @route   POST /api/projects/:id/members
 * @access  Private (Owner/Admin)
 */
const addMember = catchAsync(async (req, res) => {
  const { userId, role = 'member' } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (!project.isAdminOrOwner(req.user._id)) {
    throw ApiError.forbidden('Only project owner or admin can add members');
  }

  // Check if user exists
  const userToAdd = await User.findById(userId);
  if (!userToAdd) {
    throw ApiError.notFound('User not found');
  }

  // Check if already a member
  if (project.isMember(userId)) {
    throw ApiError.conflict('User is already a member of this project');
  }

  project.members.push({ user: userId, role });
  await project.save();

  // Log activity
  await logActivity({
    user: req.user._id,
    userName: req.user.name,
    type: ACTIVITY_TYPE.MEMBER_ADDED,
    message: `added ${userToAdd.name} to "${project.title}"`,
    project: project._id,
  });

  // Send notification to added user
  await createNotification({
    receiver: userId,
    type: NOTIFICATION_TYPE.MEMBER_ADDED,
    title: 'Added to Project',
    message: `You were added to the ${project.title} project`,
    userId: req.user._id,
    link: `/projects/${project._id}`,
  });

  const enriched = await enrichProjectWithStats(project.toJSON());

  ApiResponse.ok(res, 'Member added successfully', enriched);
});

/**
 * @desc    Remove a member from a project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private (Owner/Admin)
 */
const removeMember = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (!project.isAdminOrOwner(req.user._id)) {
    throw ApiError.forbidden('Only project owner or admin can remove members');
  }

  const { userId } = req.params;

  // Cannot remove the owner
  if (project.owner.toString() === userId) {
    throw ApiError.badRequest('Cannot remove the project owner');
  }

  // Check if user is a member
  const memberIndex = project.members.findIndex((m) => m.user.toString() === userId);
  if (memberIndex === -1) {
    throw ApiError.notFound('User is not a member of this project');
  }

  const removedUser = await User.findById(userId);
  project.members.splice(memberIndex, 1);
  await project.save();

  // Log activity
  await logActivity({
    user: req.user._id,
    userName: req.user.name,
    type: ACTIVITY_TYPE.MEMBER_REMOVED,
    message: `removed ${removedUser?.name || 'a member'} from "${project.title}"`,
    project: project._id,
  });

  const enriched = await enrichProjectWithStats(project.toJSON());

  ApiResponse.ok(res, 'Member removed successfully', enriched);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
