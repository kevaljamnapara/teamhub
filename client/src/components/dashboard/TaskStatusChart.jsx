/** Task Status Distribution Chart */
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = {
  todo: "#94a3b8",
  in_progress: "#6366f1",
  done: "#22c55e",
  blocked: "#ef4444",
};

const LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
  blocked: "Blocked",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
          {payload[0].name}
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {payload[0].value} tasks ({Math.round(payload[0].percent * 100)}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function TaskStatusChart({ tasksByStatus = {} }) {
  const data = Object.entries(tasksByStatus).map(([status, count]) => ({
    name: LABELS[status] || status,
    value: count,
    color: COLORS[status] || "#94a3b8",
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">
        Task Status
      </h3>
      <div className="h-[280px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[hsl(var(--muted-foreground))]">
            No task data available yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}
