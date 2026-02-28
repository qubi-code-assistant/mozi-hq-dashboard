import { NextResponse } from "next/server";
import { getTaskById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const task = await getTaskById(params.id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(task, { headers: { "Cache-Control": "no-store" } });
}
