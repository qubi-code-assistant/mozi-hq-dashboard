"use client";

import { useEffect, useState } from "react";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { parseChecklist } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { getAgentAccent } from "@/lib/agents";
import type { Task, Activity, Document, Priority, TaskState } from "@/lib/types";

type ActiveTask = Task & { activity: Activity[]; documents: Document[] };

export function ActiveTicketHero() {
  const [task, setTask] = useState<ActiveTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/hq/tasks/active")
      .then((r) => r.json())
      .then((data) => setTask(data))
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task || !input.trim()) return;
    setSending(true);
    try {
      await fetch("/api/hq/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          content: input.trim(),
          mentions: task.assigned_to ? [task.assigned_to] : [],
        }),
      });
      setInput("");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="executive-card p-8 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="executive-card p-8 text-center">
        <MaterialIcon name="pending_actions" className="text-5xl text-slate-300 mb-3" />
        <p className="text-slate-500 font-display font-bold text-lg">
          No active tasks
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Fire up an agent to get started
        </p>
      </div>
    );
  }

  const accent = task.assigned_to ? getAgentAccent(task.assigned_to) : "#6B7280";
  const docContent = task.documents?.map((d) => d.content).join("\n") ?? "";
  const checklist = parseChecklist(task.description ?? docContent);

  return (
    <div
      className="executive-card p-6 border-l-4"
      style={{ borderLeftColor: accent }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Task info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {task.goal_title && (
              <span className="status-pill bg-blue-50 text-blue-600 border border-blue-100">
                {task.goal_title}
              </span>
            )}
            <StatusBadge state={task.state as TaskState} />
            <PriorityBadge priority={task.priority as Priority} />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800">
            {task.title}
          </h3>
          {task.assigned_to && task.agent_name && (
            <div className="flex items-center gap-2">
              <AgentAvatar
                agentId={task.assigned_to}
                name={task.agent_name}
                size="sm"
              />
              <span className="text-sm font-bold text-slate-600">
                {task.agent_name}
              </span>
            </div>
          )}
          {task.description && (
            <p className="text-sm text-slate-500 line-clamp-3">
              {task.description}
            </p>
          )}
        </div>

        {/* Centre — Checklist */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Progress
          </h4>
          {checklist.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {checklist.map((section, si) => (
                <div key={si}>
                  {section.header && (
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      {section.header}
                    </p>
                  )}
                  {section.items.map((item, ii) => (
                    <label
                      key={ii}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        readOnly
                        className="rounded border-slate-300"
                      />
                      <span className={item.checked ? "line-through text-slate-400" : ""}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No checklist items</p>
          )}
        </div>

        {/* Right — Activity log */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Live Log
          </h4>
          <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-300 h-48 overflow-y-auto">
            {task.activity && task.activity.length > 0 ? (
              task.activity.map((a) => (
                <div key={a.id} className="mb-1">
                  <span className="text-slate-500">
                    {timeAgo(a.created_at)}
                  </span>{" "}
                  <span style={{ color: getAgentAccent(a.agent) }}>
                    {a.agent}
                  </span>{" "}
                  {a.action}
                  {a.detail && (
                    <span className="text-slate-500"> — {a.detail}</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-slate-500">No activity yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom — Human-in-loop input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Give instructions to ${task.agent_name ?? "agent"}...`}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-exec-accent/50 focus:border-exec-accent"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="px-5 py-2 rounded-lg bg-exec-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <MaterialIcon name="send" className="text-sm" />
          Send
        </button>
      </form>
    </div>
  );
}
