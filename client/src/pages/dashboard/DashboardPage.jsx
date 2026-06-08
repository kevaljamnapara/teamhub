import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
} from "../../store/slices/dashboardSlice";
import StatsCards from "../../components/dashboard/StatsCards";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import ActivityFeed from "../../components/dashboard/ActivityFeed";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Dashboard
          </h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))]">
            Welcome back! Here's an overview of your workspace.
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchDashboardStats())}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Loading State */}
      {loading && !stats && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-3" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading dashboard...</p>
        </div>
      )}

      {/* Error State */}
      {error && !stats && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-danger-500" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
            Failed to Load Dashboard
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchDashboardStats())}
            className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      {stats && (
        <>
          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <TaskStatusChart tasksByStatus={stats.tasksByStatus} />
            <WeeklyChart recentActivities={stats.recentActivities} />
          </div>

          {/* Activity Feed */}
          <div className="mt-6">
            <ActivityFeed activities={stats.recentActivities} />
          </div>
        </>
      )}
    </motion.div>
  );
}
