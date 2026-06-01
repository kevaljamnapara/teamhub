import { cn } from "../../utils";
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from "../../constants/status";

export default function TaskStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium",
        TASK_STATUS_COLORS[status]
      )}
    >
      {TASK_STATUS_LABELS[status] || status}
    </span>
  );
}
