"use client";

import { useState } from "react";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { timeAgo } from "@/lib/utils";
import { AGENT_META } from "@/lib/agents";
import type { Comment } from "@/lib/types";

export function ChatTab({
  taskId,
  comments: initialComments,
}: {
  taskId: string;
  comments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/hq/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, content: input.trim() }),
      });
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setInput("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[400px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 && (
          <p className="text-center text-slate-400 text-sm mt-8">
            No comments yet
          </p>
        )}
        {comments.map((c) => {
          const isEduard = c.author === "Eduard";
          const agentMeta = AGENT_META[c.author];

          return (
            <div
              key={c.id}
              className={`flex gap-3 ${isEduard ? "flex-row-reverse" : ""}`}
            >
              {isEduard ? (
                <div className="size-8 rounded-full bg-exec-dark flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
                  E
                </div>
              ) : (
                <AgentAvatar
                  agentId={c.author}
                  name={agentMeta?.name ?? c.author}
                  size="sm"
                />
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isEduard
                    ? "bg-exec-dark text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <p className="text-xs font-bold mb-1 opacity-70">
                  {agentMeta?.name ?? c.author}
                </p>
                <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                <p className="text-[10px] opacity-50 mt-1 text-right">
                  {timeAgo(c.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 p-4 flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this ticket or give instructions..."
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-exec-accent/50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="px-4 py-2 rounded-lg bg-exec-dark text-white text-sm font-bold disabled:opacity-50 flex items-center gap-2"
        >
          <MaterialIcon name="send" className="text-sm" />
        </button>
      </form>
    </div>
  );
}
