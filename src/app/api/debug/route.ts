import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);
  const tasks = await sql`SELECT id, title, state FROM hq_tasks`;
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  return NextResponse.json({ 
    tasks, 
    tables: tables.map((t: Record<string, string>) => t.tablename),
    db_url_prefix: url.split('@')[1]?.split('/')[0]
  }, { headers: { "Cache-Control": "no-store" } });
}
