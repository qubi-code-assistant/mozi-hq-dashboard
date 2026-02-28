import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  // Agent is "working" if they have an in_progress or peer_review task
  const agents = await sql`
    SELECT a.*,
      CASE WHEN t.id IS NOT NULL THEN 'working' ELSE 'idle' END as status
    FROM hq_agents a
    LEFT JOIN hq_tasks t ON t.assigned_to = a.id
      AND t.state IN ('in_progress', 'peer_review')
    ORDER BY a.name
  `;
  return NextResponse.json(agents, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
