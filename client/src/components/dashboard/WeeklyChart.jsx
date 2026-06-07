import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
          {label}
        </p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm text-[hsl(var(--muted-foreground))]">
            <span style={{ color: p.color }}>●</span> {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeeklyChart() {
  const weeklyActivityData = []; // To be replaced with real chart data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">
        Weekly Activity
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivityData} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="tasks"
              name="Tasks"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="commits"
              name="Commits"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
