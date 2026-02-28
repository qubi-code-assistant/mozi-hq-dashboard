import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    ORDER BY t.updated_at DESC
  `;

  const backlog = rows.filter((t) => t.state === "backlog" || t.state === "todo");
  const inProgress = rows.filter((t) => t.state === "in_progress");
  const review = rows.filter((t) => t.state === "peer_review" || t.state === "review");
  const done = rows.filter((t) => t.state === "approved" || t.state === "done");

  return NextResponse.json({ backlog, inProgress, review, done }, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
