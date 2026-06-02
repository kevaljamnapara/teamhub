const mongoose = require('mongoose');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Map field names to match frontend expectations
        ret.projectId = ret.project
          ? typeof ret.project === 'object'
            ? ret.project._id?.toString() || ret.project.toString()
            : ret.project.toString()
          : null;
        ret.assigneeId = ret.assignee
          ? typeof ret.assignee === 'object'
            ? ret.assignee._id?.toString() || ret.assignee.toString()
            : ret.assignee.toString()
          : null;
        delete ret._id;
        delete ret.__v;
        delete ret.project;
        delete ret.assignee;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// --------------- Indexes ---------------

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ project: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
