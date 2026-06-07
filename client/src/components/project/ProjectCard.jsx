import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, MoreHorizontal } from "lucide-react";
import { cn, formatDate, getInitials } from "../../utils";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "../../constants/status";

export default function ProjectCard({ project, index = 0 }) {
  const navigate = useNavigate();
  const members = []; // To be replaced with real user data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group relative p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Color accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: project.color }}
      />

      <div className="flex items-start justify-between mb-3 mt-1">
        <div>
          <h3 className="font-semibold text-[hsl(var(--foreground))] group-hover:text-primary-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Status & Priority badges */}
      <div className="flex items-center gap-2 mb-4">
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
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Progress
          </span>
          <span className="text-xs font-medium text-[hsl(var(--foreground))]">
            {project.progress}%
          </span>
        </div>
        <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ delay: index * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold border-2 border-[hsl(var(--card))]"
                title={member.name}
              >
                {getInitials(member.name)}
              </div>
            ))}
            {members.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-[10px] font-medium text-[hsl(var(--muted-foreground))] border-2 border-[hsl(var(--card))]">
                +{members.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            <Users className="w-3 h-3 inline mr-1" />
            {members.length}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
          <Calendar className="w-3 h-3" />
          {formatDate(project.dueDate)}
        </div>
      </div>
    </motion.div>
  );
}
