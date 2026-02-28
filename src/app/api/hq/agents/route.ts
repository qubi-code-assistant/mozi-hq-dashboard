import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const agents = await getAllAgents();
  return NextResponse.json(agents, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
