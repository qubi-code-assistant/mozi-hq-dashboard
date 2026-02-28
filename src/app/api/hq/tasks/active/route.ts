import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const taskRows = await sql`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    WHERE t.state IN ('in_progress', 'peer_review')
    ORDER BY t.updated_at DESC
    LIMIT 1
  `;
  if (taskRows.length === 0) return NextResponse.json(null, { headers: { "Cache-Control": "no-store" } });
  const task = taskRows[0];
  const [activity, documents] = await Promise.all([
    sql`SELECT * FROM hq_activity WHERE task_id = ${task.id} ORDER BY created_at DESC LIMIT 8`,
    sql`SELECT * FROM hq_documents WHERE task_id = ${task.id} ORDER BY created_at DESC`,
  ]);
  return NextResponse.json({ ...task, activity, documents }, { headers: { "Cache-Control": "no-store" } });
}
