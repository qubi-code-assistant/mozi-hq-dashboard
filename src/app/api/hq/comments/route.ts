import { NextResponse } from "next/server";
import { createComment } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { taskId, content, mentions } = body;

  if (!taskId || !content) {
    return NextResponse.json(
      { error: "taskId and content are required" },
      { status: 400 }
    );
  }

  const comment = await createComment(taskId, content, mentions ?? []);
  return NextResponse.json(comment, { status: 201, headers: { "Cache-Control": "no-store" } });
}
