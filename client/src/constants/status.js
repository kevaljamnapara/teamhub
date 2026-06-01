export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  BLOCKED: "blocked",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: "Todo",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
  [TASK_STATUS.BLOCKED]: "Blocked",
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: "bg-surface-400/20 text-surface-500 dark:text-surface-400",
  [TASK_STATUS.IN_PROGRESS]: "bg-primary-500/15 text-primary-600 dark:text-primary-400",
  [TASK_STATUS.DONE]: "bg-success-500/15 text-success-600 dark:text-success-500",
  [TASK_STATUS.BLOCKED]: "bg-danger-500/15 text-danger-600 dark:text-danger-500",
};

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: "Low",
  [PRIORITY.MEDIUM]: "Medium",
  [PRIORITY.HIGH]: "High",
  [PRIORITY.URGENT]: "Urgent",
};

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: "bg-surface-400/20 text-surface-500",
  [PRIORITY.MEDIUM]: "bg-primary-500/15 text-primary-600 dark:text-primary-400",
  [PRIORITY.HIGH]: "bg-warning-500/15 text-warning-600 dark:text-warning-500",
  [PRIORITY.URGENT]: "bg-danger-500/15 text-danger-600 dark:text-danger-500",
};

export const PROJECT_STATUS = {
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  ARCHIVED: "archived",
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.ACTIVE]: "Active",
  [PROJECT_STATUS.ON_HOLD]: "On Hold",
  [PROJECT_STATUS.COMPLETED]: "Completed",
  [PROJECT_STATUS.ARCHIVED]: "Archived",
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.ACTIVE]: "bg-success-500/15 text-success-600 dark:text-success-500",
  [PROJECT_STATUS.ON_HOLD]: "bg-warning-500/15 text-warning-600 dark:text-warning-500",
  [PROJECT_STATUS.COMPLETED]: "bg-primary-500/15 text-primary-600 dark:text-primary-400",
  [PROJECT_STATUS.ARCHIVED]: "bg-surface-400/20 text-surface-500",
};
