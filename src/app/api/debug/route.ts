import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "NOT_SET";
  const masked = url === "NOT_SET" ? "NOT_SET" : url.replace(/:([^@]+)@/, ":***@");
  try {
    const sql = neon(url);
    const rows = await sql`SELECT id, status, updated_at FROM hq_agents WHERE id = 'woz'`;
    return NextResponse.json({ db_url: masked, woz: rows[0] });
  } catch (e: unknown) {
    return NextResponse.json({ db_url: masked, error: String(e) });
  }
}
