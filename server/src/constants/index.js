/**
 * Application-wide constants and enums.
 * Values are lowercase with underscores to match the frontend exactly.
 */

const TASK_STATUS = Object.freeze({
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  BLOCKED: 'blocked',
});

const TASK_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});

const PROJECT_STATUS = Object.freeze({
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
});

const USER_ROLE = Object.freeze({
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
});

const NOTIFICATION_TYPE = Object.freeze({
  TASK_ASSIGNED: 'task_assigned',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  PROJECT_INVITE: 'project_invite',
  PROJECT_UPDATED: 'project_updated',
  MEMBER_ADDED: 'member_added',
  COMMENT_ADDED: 'comment_added',
});

const ACTIVITY_TYPE = Object.freeze({
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  TASK_ASSIGNED: 'task_assigned',
  TASK_STATUS_CHANGED: 'task_status_changed',
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  MEMBER_ADDED: 'member_added',
  MEMBER_REMOVED: 'member_removed',
  COMMENT_ADDED: 'comment_added',
});

const ALLOWED_FILE_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

module.exports = {
  TASK_STATUS,
  TASK_PRIORITY,
  PROJECT_STATUS,
  USER_ROLE,
  NOTIFICATION_TYPE,
  ACTIVITY_TYPE,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
};
