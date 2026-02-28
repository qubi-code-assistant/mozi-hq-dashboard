import type { Priority } from "@/lib/types";
import { MaterialIcon } from "./MaterialIcon";

const PRIORITY_STYLES: Record<Priority, { color: string; label: string }> = {
  must: { color: "text-red-500", label: "Must" },
  should: { color: "text-yellow-500", label: "Should" },
  could: { color: "text-slate-400", label: "Could" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { color, label } = PRIORITY_STYLES[priority];
  return (
    <span className={`flex items-center gap-1 text-xs font-bold ${color}`}>
      <MaterialIcon name="flag" className="text-sm" /> {label}
    </span>
  );
}
