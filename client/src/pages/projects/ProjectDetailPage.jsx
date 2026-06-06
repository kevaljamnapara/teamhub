import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CheckSquare,
  FileText,
  Activity,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn, formatDate, getInitials, formatRelativeTime } from "../../utils";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "../../constants/status";

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "members", label: "Members", icon: Users },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "activity", label: "Activity", icon: Activity },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const project = useSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );
  const tasks = useSelector((state) =>
    state.tasks.tasks.filter((t) => t.projectId === id)
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Project not found
        </h2>
        <button
          onClick={() => navigate("/projects")}
          className="mt-4 text-sm text-primary-500 hover:text-primary-600"
        >
          Back to projects
        </button>
      </div>
    );
  }

  const members = []; // To be replaced with real user data

  const projectActivities = []; // To be replaced with real activity data

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/projects")}
        className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Project header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              {project.title}
            </h1>
          </div>
          <p className="text-[hsl(var(--muted-foreground))] max-w-xl">
            {project.description}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-lg text-xs font-medium",
                PROJECT_STATUS_COLORS[project.status]
              )}
            >
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-lg text-xs font-medium",
                PRIORITY_COLORS[project.priority]
              )}
            >
              {PRIORITY_LABELS[project.priority]}
            </span>
            <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Calendar className="w-3 h-3" />
              Due {formatDate(project.dueDate)}
            </span>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">
            Overall Progress
          </span>
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            {project.progress}%
          </span>
        </div>
        <div className="h-2.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
          {project.completedTasks} of {project.taskCount} tasks completed
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[hsl(var(--border))] mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
                Task Summary
              </h4>
              <div className="space-y-2">
                {["todo", "in_progress", "done", "blocked"].map((status) => {
                  const count = tasks.filter((t) => t.status === status).length;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          TASK_STATUS_COLORS[status]
                        )}
                      >
                        {TASK_STATUS_LABELS[status]}
                      </span>
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
                Team Members
              </h4>
              <div className="space-y-3">
                {members.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(m.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {m.name}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {m.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
                Details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Created</p>
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Due Date</p>
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {formatDate(project.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Tasks</p>
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {tasks.length} total
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {getInitials(member.name)}
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {member.name}
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {member.role}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const assignee = null; // To be replaced with real user data
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          TASK_STATUS_COLORS[task.status]
                        )}
                      >
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          PRIORITY_COLORS[task.priority]
                        )}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {assignee && (
                        <div
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold"
                          title={assignee.name}
                        >
                          {getInitials(assignee.name)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                No tasks in this project yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-1">
            {projectActivities.length > 0 ? (
              projectActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--foreground))]">
                      <span className="font-medium">{act.userName}</span>{" "}
                      <span className="text-[hsl(var(--muted-foreground))]">
                        {act.message}
                      </span>
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {formatRelativeTime(act.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                No activity yet.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
