"use client";
import { useEffect, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export function ProjectOperations() {
  const [data, setData] = useState<{ backlog: Row[]; inProgress: Row[]; review: Row[]; done: Row[] }>({
    backlog: [], inProgress: [], review: [], done: []
  });

  useEffect(() => {
    fetch("/api/hq/tasks", { cache: "no-store" })
      .then(r => r.json())
      .then(setData)
      .catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/hq/tasks", { cache: "no-store" }).then(r => r.json()).then(setData).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-2 h-full min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-700 text-xl font-display font-bold flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
            <MaterialIcon name="view_kanban" />
          </div>
          Project Operations
        </h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-500 hover:border-exec-accent transition-colors shadow-sm flex items-center gap-2">
            <MaterialIcon name="filter_list" className="text-sm" /> Filter
          </button>
          <button className="px-4 py-2 rounded-lg bg-exec-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
            <MaterialIcon name="add" className="text-sm" /> New Task
          </button>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 pb-1">
        <div className="grid grid-cols-4 gap-4 min-w-[800px] h-full">
          <KanbanColumn title="Backlog"     tasks={data.backlog} />
          <KanbanColumn title="In Progress" tasks={data.inProgress} />
          <KanbanColumn title="Review"      tasks={data.review} />
          <KanbanColumn title="Done"        tasks={data.done} />
        </div>
      </div>
    </section>
  );
}
