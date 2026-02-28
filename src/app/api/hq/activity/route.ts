import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  const { agent, action, task_id, detail, created_at } = await req.json();
  const rows = await sql`INSERT INTO hq_activity (agent, action, task_id, detail, created_at) VALUES (${agent}, ${action}, ${task_id ?? null}, ${detail ?? null}, ${created_at ?? new Date().toISOString()}) RETURNING *`;
  return NextResponse.json(rows[0], { status: 201, headers: { "Cache-Control": "no-store" } });
}
