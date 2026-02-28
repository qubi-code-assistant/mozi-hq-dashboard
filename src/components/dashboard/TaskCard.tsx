"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import type { Task, Priority } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDone = task.state === "done" || task.state === "approved";
  const isInProgress = task.state === "in_progress";

  function openModal() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", task.id);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      onClick={openModal}
      className={`executive-card p-4 cursor-pointer group ${
        isInProgress ? "border-l-4 border-l-exec-accent" : ""
      } ${isDone ? "opacity-75 hover:opacity-100 transition-opacity" : "hover:border-exec-accent"}`}
    >
      {/* Category + kebab */}
      <div className="flex justify-between items-start mb-2">
        {isDone ? (
          <span className="status-pill bg-green-100 text-green-700 flex items-center gap-1">
            <MaterialIcon name="check" className="text-[10px]" /> Done
          </span>
        ) : task.goal_title ? (
          <span className="status-pill bg-blue-50 text-blue-600 border border-blue-100">
            {task.goal_title}
          </span>
        ) : (
          <span className="status-pill bg-slate-50 text-slate-500 border border-slate-200">
            Task
          </span>
        )}
        {isDone ? (
          <MaterialIcon name="check_circle" className="text-green-600" />
        ) : (
          <MaterialIcon
            name="more_horiz"
            className="text-slate-300 group-hover:text-exec-accent"
          />
        )}
      </div>

      {/* Title */}
      <h4
        className={`font-bold text-base mb-1 ${
          isDone
            ? "line-through text-slate-400 decoration-2"
            : "text-slate-800"
        }`}
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p
          className={`text-xs mb-3 line-clamp-2 ${
            isDone ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {task.description}
        </p>
      )}

      {/* Progress bar for in_progress */}
      {isInProgress && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
          <div
            className="bg-exec-accent h-1.5 rounded-full transition-all"
            style={{ width: "45%" }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        {task.assigned_to && task.agent_name ? (
          <AgentAvatar
            agentId={task.assigned_to}
            name={task.agent_name}
            size="sm"
          />
        ) : (
          <span className="text-xs text-slate-400">Unassigned</span>
        )}
        <PriorityBadge priority={task.priority as Priority} />
      </div>
    </div>
  );
}
