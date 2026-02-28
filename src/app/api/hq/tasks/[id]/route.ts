import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const sql = neon(process.env.DATABASE_URL!);
  const taskRows = await sql`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    WHERE t.id = ${params.id}
  `;
  if (!taskRows.length) return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  const task = taskRows[0];
  const [comments, documents, activity] = await Promise.all([
    sql`SELECT * FROM hq_comments WHERE task_id = ${params.id} ORDER BY created_at ASC`,
    sql`SELECT * FROM hq_documents WHERE task_id = ${params.id} ORDER BY created_at DESC`,
    sql`SELECT * FROM hq_activity WHERE task_id = ${params.id} ORDER BY created_at ASC`,
  ]);
  return NextResponse.json({ ...task, comments, documents, activity }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: Request, { params }: Params) {
  const sql = neon(process.env.DATABASE_URL!);
  const body = await req.json();
  const { state, description, pr_url } = body;
  if (state) await sql`UPDATE hq_tasks SET state = ${state}, updated_at = NOW() WHERE id = ${params.id}`;
  if (description) await sql`UPDATE hq_tasks SET description = ${description}, updated_at = NOW() WHERE id = ${params.id}`;
  if (pr_url) await sql`UPDATE hq_tasks SET pr_url = ${pr_url}, updated_at = NOW() WHERE id = ${params.id}`;
  const rows = await sql`SELECT * FROM hq_tasks WHERE id = ${params.id}`;
  return NextResponse.json(rows[0], { headers: { "Cache-Control": "no-store" } });
}
