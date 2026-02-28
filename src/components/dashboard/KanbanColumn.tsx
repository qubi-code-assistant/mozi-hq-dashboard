import { TaskCard } from "./TaskCard";
import type { Task } from "@/lib/types";

const COL_DOTS: Record<string, string> = {
  Backlog: "bg-slate-400",
  "In Progress": "bg-exec-accent",
  Review: "bg-purple-500",
  Done: "bg-green-500",
};

export function KanbanColumn({
  title,
  tasks,
}: {
  title: string;
  tasks: Task[];
}) {
  const dot = COL_DOTS[title] ?? "bg-slate-400";

  return (
    <div className="kanban-col flex flex-col h-full min-h-[500px]">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100 rounded-t-lg">
        <span className="text-slate-700 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className={`size-2 rounded-full ${dot}`} />
          {title}
        </span>
        <span className="bg-white text-slate-500 text-xs px-2 py-1 rounded border border-slate-200 font-bold">
          {tasks.length}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
