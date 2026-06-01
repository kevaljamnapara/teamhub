import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Bell,
  CheckSquare,
  FolderKanban,
  UserPlus,
  MessageSquare,
  CheckCheck,
} from "lucide-react";
import {
  markAsRead,
  markAllAsRead,
  selectUnreadCount,
} from "../../store/slices/notificationSlice";
import { cn, formatRelativeTime } from "../../utils";

const NOTIF_ICONS = {
  task_assigned: { icon: CheckSquare, color: "text-primary-500", bg: "bg-primary-500/10" },
  task_completed: { icon: CheckSquare, color: "text-success-500", bg: "bg-success-500/10" },
  project_updated: { icon: FolderKanban, color: "text-violet-500", bg: "bg-violet-500/10" },
  member_added: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  comment_added: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const unreadCount = useSelector(selectUnreadCount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Notifications
          </h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))]">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-500 hover:bg-primary-500/10 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif, index) => {
            const config = NOTIF_ICONS[notif.type] || {
              icon: Bell,
              color: "text-surface-400",
              bg: "bg-surface-400/10",
            };
            const Icon = config.icon;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => dispatch(markAsRead(notif.id))}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                  notif.read
                    ? "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                    : "border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10"
                )}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={cn(
                        "text-sm",
                        notif.read
                          ? "font-medium text-[hsl(var(--foreground))]"
                          : "font-semibold text-[hsl(var(--foreground))]"
                      )}
                    >
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                    {notif.message}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
            No Notifications
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            When something happens, you'll see it here.
          </p>
        </div>
      )}
    </motion.div>
  );
}
