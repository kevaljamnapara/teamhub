const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Map author → userId to match frontend mock comment shape
        ret.userId = ret.author
          ? typeof ret.author === 'object'
            ? ret.author._id?.toString() || ret.author.toString()
            : ret.author.toString()
          : null;
        delete ret._id;
        delete ret.__v;
        delete ret.author;
        delete ret.task;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// --------------- Indexes ---------------

commentSchema.index({ task: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
