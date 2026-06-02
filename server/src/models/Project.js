const mongoose = require('mongoose');
const { PROJECT_STATUS, TASK_PRIORITY } = require('../constants');

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [memberSchema],
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ACTIVE,
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
    },
    color: {
      type: String,
      default: '#6366f1',
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
        delete ret._id;
        delete ret.__v;
        // Flatten members to array of user ID strings for frontend compatibility
        if (ret.members && Array.isArray(ret.members)) {
          ret.members = ret.members.map((m) =>
            typeof m.user === 'object' && m.user !== null
              ? m.user._id
                ? m.user._id.toString()
                : m.user.toString()
              : m.user.toString()
          );
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// --------------- Indexes ---------------

projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ status: 1 });

// --------------- Methods ---------------

/**
 * Check if a user is a member of the project (owner counts as member).
 * @param {string} userId
 * @returns {boolean}
 */
projectSchema.methods.isMember = function (userId) {
  const uid = userId.toString();
  if (this.owner.toString() === uid) return true;
  return this.members.some((m) => m.user.toString() === uid);
};

/**
 * Check if a user is the owner or an admin of the project.
 * @param {string} userId
 * @returns {boolean}
 */
projectSchema.methods.isAdminOrOwner = function (userId) {
  const uid = userId.toString();
  if (this.owner.toString() === uid) return true;
  return this.members.some((m) => m.user.toString() === uid && m.role === 'admin');
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
