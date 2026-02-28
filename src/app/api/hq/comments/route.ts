import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { taskId, content, mentions } = body;
  if (!taskId || !content) {
    return NextResponse.json({ error: "taskId and content required" }, { status: 400 });
  }
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    INSERT INTO hq_comments (task_id, author, content, mentions)
    VALUES (${taskId}, 'Eduard', ${content}, ${mentions ?? []})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201, headers: { "Cache-Control": "no-store" } });
}
