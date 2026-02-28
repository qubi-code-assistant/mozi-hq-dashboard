import { neon } from "@neondatabase/serverless";
import { KanbanColumn } from "./KanbanColumn";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export async function ProjectOperations() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows: Row[] = await sql`SELECT * FROM hq_tasks ORDER BY created_at DESC`;

  const agentIdSet: Record<string, boolean> = {};
  rows.forEach((t) => { if (t.assigned_to) agentIdSet[t.assigned_to] = true; });
  const agentIds = Object.keys(agentIdSet);
  const agents: Row[] = agentIds.length > 0
    ? await sql`SELECT id, name FROM hq_agents WHERE id = ANY(${agentIds})`
    : [];
  const agentMap: Record<string, string> = {};
  agents.forEach((a) => { agentMap[a.id] = a.name; });
  const enrich = (t: Row) => ({ ...t, agent_name: agentMap[t.assigned_to] ?? null });

  const backlog    = rows.filter((t) => t.state === "backlog" || t.state === "todo").map(enrich);
  const inProgress = rows.filter((t) => t.state === "in_progress").map(enrich);
  const review     = rows.filter((t) => t.state === "peer_review" || t.state === "review").map(enrich);
  const done       = rows.filter((t) => t.state === "approved" || t.state === "done").map(enrich);

  return (
    <section className="flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-700 text-2xl font-display font-bold flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <MaterialIcon name="view_kanban" />
          </div>
          Project Operations
        </h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-500 hover:text-exec-accent hover:border-exec-accent transition-colors shadow-sm flex items-center gap-2">
            <MaterialIcon name="filter_list" className="text-sm" /> Filter
          </button>
          <button className="px-4 py-2 rounded-lg bg-exec-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
            <MaterialIcon name="add" className="text-sm" /> New Task
          </button>
        </div>
      </div>

      {/* Kanban — horizontal scroll on overflow */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-4 gap-4 min-w-[800px]">
          <KanbanColumn title="Backlog"     tasks={backlog} />
          <KanbanColumn title="In Progress" tasks={inProgress} />
          <KanbanColumn title="Review"      tasks={review} />
          <KanbanColumn title="Done"        tasks={done} />
        </div>
      </div>
    </section>
  );
}
