import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const sql = neon(process.env.DATABASE_URL!);
  const taskRows = await sql`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    WHERE t.id = ${params.id}
  `;
  if (taskRows.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const task = taskRows[0];
  const [comments, documents, activity] = await Promise.all([
    sql`SELECT * FROM hq_comments WHERE task_id = ${params.id} ORDER BY created_at ASC`,
    sql`SELECT * FROM hq_documents WHERE task_id = ${params.id} ORDER BY created_at DESC`,
    sql`SELECT * FROM hq_activity WHERE task_id = ${params.id} ORDER BY created_at DESC`,
  ]);
  return NextResponse.json({ ...task, comments, documents, activity }, { headers: { "Cache-Control": "no-store" } });
}
