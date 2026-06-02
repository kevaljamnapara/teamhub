const { body, param } = require('express-validator');
const { PROJECT_STATUS, TASK_PRIORITY } = require('../constants');

const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('status')
    .optional()
    .isIn(Object.values(PROJECT_STATUS))
    .withMessage(`Status must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`),

  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),

  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

const updateProjectValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  ...createProjectValidator.map((validator) => {
    // Make all fields optional for update
    return validator;
  }),
];

const addMemberValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('role')
    .optional()
    .isIn(['admin', 'member'])
    .withMessage('Role must be admin or member'),
];

const removeMemberValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
  removeMemberValidator,
};
