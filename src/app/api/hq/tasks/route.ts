import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export async function GET() {
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

  const enrich = (t: Row) => ({ ...t, agent_name: agentMap[t.assigned_to] ?? null, goal_title: null });

  return NextResponse.json({
    backlog:    rows.filter((t) => t.state === "backlog" || t.state === "todo").map(enrich),
    inProgress: rows.filter((t) => t.state === "in_progress").map(enrich),
    review:     rows.filter((t) => t.state === "peer_review" || t.state === "review").map(enrich),
    done:       rows.filter((t) => t.state === "approved" || t.state === "done").map(enrich),
  }, { headers: { "Cache-Control": "no-store, no-cache" } });
}
