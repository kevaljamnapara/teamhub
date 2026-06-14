/** Slide-out Drawer for Task Details */
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, MessageSquare, Clock } from "lucide-react";
import { clearSelectedTask, updateTask, addComment, fetchComments, deleteComment } from "../../store/slices/taskSlice";
import FileUpload from "../common/FileUpload";
import { cn, formatDate, formatRelativeTime, getInitials } from "../../utils";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "../../constants/status";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function TaskDetailsDrawer({ task }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const isOpen = !!task;
  const assignee = null; // To be replaced with real user data

  const handleClose = () => dispatch(clearSelectedTask());

  useEffect(() => {
    if (task) {
      dispatch(fetchComments(task._id || task.id));
    }
  }, [dispatch, task?._id, task?.id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTask({ id: task._id || task.id, status: newStatus })).unwrap();
      toast.success("Status updated");
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await dispatch(
        addComment({
          taskId: task._id || task.id,
          text: commentText,
        })
      ).unwrap();
      setCommentText("");
    } catch (err) {
      toast.error(err || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(
        deleteComment({ taskId: task._id || task.id, commentId })
      ).unwrap();
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err || "Failed to delete comment");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-full max-w-lg bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] truncate pr-4">
                {task.title}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status & Priority */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium",
                    TASK_STATUS_COLORS[task.status]
                  )}
                >
                  {TASK_STATUS_LABELS[task.status]}
                </span>
                <span
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium",
                    PRIORITY_COLORS[task.priority]
                  )}
                >
                  {PRIORITY_LABELS[task.priority]}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">
                  Description
                </h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[hsl(var(--muted))]/50">
                  <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs">Assignee</span>
                  </div>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-semibold">
                        {getInitials(assignee.name)}
                      </div>
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      Unassigned
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[hsl(var(--muted))]/50">
                  <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Due Date</span>
                  </div>
                  <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              {/* Change Status */}
              <div>
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["todo", "in_progress", "done", "blocked"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        task.status === status
                          ? TASK_STATUS_COLORS[status] +
                              " ring-2 ring-offset-1 ring-[hsl(var(--ring))] ring-offset-[hsl(var(--background))]"
                          : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                      )}
                    >
                      {TASK_STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments ({task.comments?.length || 0})
                </h4>
                <div className="space-y-3 mb-4">
                  {task.comments?.map((comment) => {
                    const commenter = comment.user || null;
                    const commentId = comment._id || comment.id;
                    return (
                      <div key={commentId} className="flex gap-3 group">
                        <div className="w-7 h-7 rounded bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                          {getInitials(commenter?.name || "U")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                              {commenter?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {comment.text}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(commentId)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-[hsl(var(--muted-foreground))] hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-all self-start"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  {(!task.comments || task.comments.length === 0) && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">
                      No comments yet
                    </p>
                  )}
                </div>

                {/* Add comment */}
                <div className="space-y-4">
                  <FileUpload 
                    onUploadSuccess={(url) => setCommentText(prev => prev + `\n\n![Attachment](${url})`)} 
                  />
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>

              {/* History */}
              <div>
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  History
                </h4>
                <div className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <p>Created {formatRelativeTime(task.createdAt)}</p>
                  <p>Last updated {formatRelativeTime(task.updatedAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
