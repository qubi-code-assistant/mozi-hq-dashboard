import { NextResponse } from "next/server";
import { getTasksGrouped } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const tasks = await getTasksGrouped();
  return NextResponse.json(tasks, { headers: { "Cache-Control": "no-store" } });
}
