const mongoose = require('mongoose');
const { ACTIVITY_TYPE } = require('../constants');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    // Denormalized for performance — avoids needing to populate for display
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPE),
      required: [true, 'Activity type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.userId = ret.user
          ? typeof ret.user === 'object'
            ? ret.user._id?.toString() || ret.user.toString()
            : ret.user.toString()
          : null;
        ret.projectId = ret.project
          ? typeof ret.project === 'object'
            ? ret.project._id?.toString() || ret.project.toString()
            : ret.project.toString()
          : null;
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        delete ret.project;
        delete ret.task;
        return ret;
      },
    },
  }
);

// --------------- Indexes ---------------

activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
