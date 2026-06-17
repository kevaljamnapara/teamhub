/** Weekly Progress Chart */
import { useMemo } from "react";
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyChart({ recentActivities = [] }) {
  // Group activities by day of week from the last 7 days
  const weeklyData = useMemo(() => {
    const now = new Date();
    const dayMap = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = DAYS[d.getDay()];
      dayMap[dayName] = { day: dayName, activities: 0 };
    }

    // Count activities per day
    recentActivities.forEach((activity) => {
      const d = new Date(activity.createdAt);
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const dayName = DAYS[d.getDay()];
        if (dayMap[dayName]) {
          dayMap[dayName].activities += 1;
        }
      }
    });

    return Object.values(dayMap);
  }, [recentActivities]);

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
        {weeklyData.some((d) => d.activities > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barGap={4}>
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
                allowDecimals={false}
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
                dataKey="activities"
                name="Activities"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[hsl(var(--muted-foreground))]">
            No activity this week yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}
