import type { TaskState } from "@/lib/types";

const STATE_STYLES: Record<TaskState, string> = {
  backlog: "bg-slate-100 text-slate-600 border border-slate-200",
  todo: "bg-slate-100 text-slate-600 border border-slate-200",
  in_progress: "bg-blue-100 text-blue-700",
  peer_review: "bg-purple-100 text-purple-700",
  review: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  done: "bg-green-100 text-green-700",
};

const STATE_LABELS: Record<TaskState, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  peer_review: "Peer Review",
  review: "Review",
  approved: "Approved",
  done: "Done",
};

export function StatusBadge({ state }: { state: TaskState }) {
  return (
    <span className={`status-pill ${STATE_STYLES[state]}`}>
      {STATE_LABELS[state]}
    </span>
  );
}
