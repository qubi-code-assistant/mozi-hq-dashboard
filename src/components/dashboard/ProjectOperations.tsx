import { getTasksGrouped } from "@/lib/db";
import { KanbanColumn } from "./KanbanColumn";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

export async function ProjectOperations() {
  const { backlog, inProgress, review, done } = await getTasksGrouped();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-slate-700 text-3xl font-display font-bold flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <MaterialIcon name="view_kanban" />
          </div>
          Project Operations
        </h2>
        <div className="flex gap-4">
          <button className="px-5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-500 hover:text-exec-accent hover:border-exec-accent transition-colors shadow-sm flex items-center gap-2">
            <MaterialIcon name="filter_list" className="text-sm" /> Filter
          </button>
          <button className="px-5 py-2 rounded-lg bg-exec-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
            <MaterialIcon name="add" className="text-sm" /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KanbanColumn title="Backlog" tasks={backlog} />
        <KanbanColumn title="In Progress" tasks={inProgress} />
        <KanbanColumn title="Review" tasks={review} />
        <KanbanColumn title="Done" tasks={done} />
      </div>
    </section>
  );
}
