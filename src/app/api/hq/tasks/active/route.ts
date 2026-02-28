import { NextResponse } from "next/server";
import { getActiveTask } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const task = await getActiveTask();
  return NextResponse.json(task, { headers: { "Cache-Control": "no-store" } });
}
