import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);
  // Force update Woz to working right here in this function
  await sql`UPDATE hq_agents SET status = 'working', updated_at = NOW() WHERE id = 'woz'`;
  const agents = await sql`SELECT id, status, updated_at FROM hq_agents ORDER BY name`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json({ agents: agents.map((a: any) => ({id: a.id, status: a.status})) }, { headers: {"Cache-Control":"no-store"} });
}
