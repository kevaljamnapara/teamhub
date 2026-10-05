/** Dashboard Statistics Cards Component */
import { motion } from "framer-motion";
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Projects",
      value: stats?.totalProjects ?? 0,
      icon: FolderKanban,
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-500/10",
      textColor: "text-primary-500",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      icon: CheckSquare,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-500/10",
      textColor: "text-violet-500",
    },
    {
      label: "Completed",
      value: stats?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
    },
    {
      label: "Pending",
      value: stats?.pendingTasks ?? 0,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={item}
            className="group relative p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 overflow-hidden"
          >
            {/* Gradient accent on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
