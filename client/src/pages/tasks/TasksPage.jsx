import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react";
import {
  fetchTasks,
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setSelectedTask,
  deleteTask,
  selectFilteredTasks,
} from "../../store/slices/taskSlice";
import TaskStatusBadge from "../../components/task/TaskStatusBadge";
import CreateTaskModal from "../../components/task/CreateTaskModal";
import TaskDetailsDrawer from "../../components/task/TaskDetailsDrawer";
import { cn, formatDate, getInitials } from "../../utils";
import { PRIORITY_LABELS, PRIORITY_COLORS } from "../../constants/status";
import toast from "react-hot-toast";

/**
 * TasksPage Component
 * Main page for viewing, filtering, and managing tasks.
 */
export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const selectedTask = useSelector((state) => state.tasks.selectedTask);
  const { searchQuery, statusFilter, priorityFilter, loading, error } = useSelector(
    (state) => state.tasks
  );
  const [showCreate, setShowCreate] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err || "Failed to delete task");
    }
    setOpenMenuId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Tasks
          </h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))]">
            View and manage all tasks across projects
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          {["all", "todo", "in_progress", "done", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => dispatch(setStatusFilter(status))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "in_progress"
                ? "In Progress"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  {["Title", "Status", "Priority", "Assignee", "Project", "Due Date", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider"
                      >
                        {h && (
                          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors">
                            {h}
                          </span>
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => {
                  const assignee = null; // To be replaced with real user data
                  const project = null; // To be replaced with real project data

                  return (
                    <motion.tr
                      key={task._id || task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))]/50 transition-colors cursor-pointer"
                      onClick={() => dispatch(setSelectedTask(task))}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                          {task.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-lg text-xs font-medium",
                            PRIORITY_COLORS[task.priority]
                          )}
                        >
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-semibold">
                              {getInitials(assignee.name)}
                            </div>
                            <span className="text-sm text-[hsl(var(--foreground))]">
                              {assignee.name.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {project ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded"
                              style={{ backgroundColor: project.color }}
                            />
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">
                              {project.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const taskId = task._id || task.id;
                            setOpenMenuId(
                              openMenuId === taskId ? null : taskId
                            );
                          }}
                          className="p-1 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === (task._id || task.id) && (
                          <div className="absolute right-4 top-full mt-1 w-36 py-1 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-xl shadow-xl z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(setSelectedTask(task));
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(task._id || task.id);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
            No Tasks Available
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm">
            {searchQuery
              ? "Try adjusting your search or filter criteria."
              : "Create your first task to get started."}
          </p>
        </div>
      )}

      <CreateTaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
      <TaskDetailsDrawer task={selectedTask} />
    </motion.div>
  );
}
