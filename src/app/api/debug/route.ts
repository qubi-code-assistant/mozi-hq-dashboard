import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL || "NOT_SET";
  const masked = url.replace(/:([^@]+)@/, ":***@");
  const sql = neon(url);
  const all = await sql`SELECT id, status, updated_at FROM hq_agents ORDER BY name`;
  const byId = await sql`SELECT id, status, updated_at FROM hq_agents WHERE id = 'woz'`;
  const count = await sql`SELECT COUNT(*) FROM hq_agents WHERE id = 'woz'`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statuses = all.map((r: any) => ({ id: r.id, status: r.status }));
  return NextResponse.json({ db_url: masked, woz_by_id: byId, woz_count: count[0], all_statuses: statuses }, { headers: { "Cache-Control": "no-store" } });
}
