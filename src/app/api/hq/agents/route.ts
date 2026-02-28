import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const agents = await sql`SELECT * FROM hq_agents ORDER BY name`;
  return NextResponse.json(agents, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
