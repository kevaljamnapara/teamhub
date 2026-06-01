import { motion } from "framer-motion";
import StatsCards from "../../components/dashboard/StatsCards";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import ActivityFeed from "../../components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Dashboard
        </h1>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          Welcome back! Here's an overview of your workspace.
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <TaskStatusChart />
        <WeeklyChart />
      </div>

      {/* Activity Feed */}
      <div className="mt-6">
        <ActivityFeed />
      </div>
    </motion.div>
  );
}
