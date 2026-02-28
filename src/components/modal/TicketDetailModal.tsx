"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { ChecklistTab } from "./ChecklistTab";
import { ChatTab } from "./ChatTab";
import { LogsTab } from "./LogsTab";
import type { TaskDetail, TaskState } from "@/lib/types";

type Tab = "checklist" | "chat" | "logs";

export function TicketDetailModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task");
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("checklist");

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      return;
    }
    setLoading(true);
    fetch(`/api/hq/tasks/${taskId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setTask(null);
        } else {
          setTask(data);
        }
      })
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (!taskId) return null;

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "/", { scroll: false });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="bg-white rounded-2xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        ) : !task ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">Task not found</p>
            <button
              onClick={close}
              className="mt-4 text-exec-accent text-sm font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {task.assigned_to && task.agent_name && (
                  <AgentAvatar
                    agentId={task.assigned_to}
                    name={task.agent_name}
                    size="lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-slate-800">
                    {task.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge state={task.state as TaskState} />
                    {task.goal_title && (
                      <span className="status-pill bg-blue-50 text-blue-600 border border-blue-100">
                        {task.goal_title}
                      </span>
                    )}
                    {task.agent_name && (
                      <span className="text-sm text-slate-500">
                        Assigned to{" "}
                        <span className="font-bold">{task.agent_name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={close}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MaterialIcon name="close" className="text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {(["checklist", "chat", "logs"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    activeTab === tab
                      ? "text-exec-accent border-b-2 border-exec-accent"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "checklist" && (
                <ChecklistTab
                  description={task.description}
                  documents={task.documents}
                />
              )}
              {activeTab === "chat" && (
                <ChatTab taskId={task.id} comments={task.comments} />
              )}
              {activeTab === "logs" && <LogsTab activity={task.activity} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
