/** User Activity Feed Component */
import { motion } from "framer-motion";
import {
  CheckCircle2,
  UserPlus,
  FolderPlus,
  MessageSquare,
  ArrowRight,
  GitBranch,
  AlertCircle,
} from "lucide-react";
import { formatRelativeTime } from "../../utils";

const ACTIVITY_ICONS = {
  task_created: { icon: CheckCircle2, color: "text-primary-500", bg: "bg-primary-500/10" },
  task_completed: { icon: CheckCircle2, color: "text-success-500", bg: "bg-success-500/10" },
  task_assigned: { icon: UserPlus, color: "text-violet-500", bg: "bg-violet-500/10" },
  task_status_changed: { icon: GitBranch, color: "text-amber-500", bg: "bg-amber-500/10" },
  project_created: { icon: FolderPlus, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  project_updated: { icon: ArrowRight, color: "text-primary-500", bg: "bg-primary-500/10" },
  member_added: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  comment_added: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
          Recent Activity
        </h3>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-1">
          {activities.slice(0, 10).map((activity, index) => {
            const config = ACTIVITY_ICONS[activity.type] || {
              icon: AlertCircle,
              color: "text-surface-400",
              bg: "bg-surface-400/10",
            };
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id || activity._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-start gap-3 py-3 group"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[hsl(var(--foreground))]">
                    <span className="font-medium">{activity.userName}</span>{" "}
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {activity.message}
                    </span>
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-[hsl(var(--muted-foreground))]">
          No recent activity yet. Create a project to get started!
        </div>
      )}
    </motion.div>
  );
}
