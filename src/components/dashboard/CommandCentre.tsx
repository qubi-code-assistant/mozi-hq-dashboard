"use client";
import { useEffect, useState } from "react";
import { AGENT_ORDER, getAgentAccent, getAgentIcon } from "@/lib/agents";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { AgentAvatar } from "@/components/shared/AgentAvatar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agent = Record<string, any>;

function AgentDesk({ agent }: { agent: Agent }) {
  const accent = getAgentAccent(agent.id);
  const icon = getAgentIcon(agent.id);
  return (
    <div className="flex flex-col items-center gap-1 desk-block">
      <div className="relative">
        <AgentAvatar agentId={agent.id} name={agent.name} size="md" />
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-400 rounded-full border-2 border-white" />
      </div>
      <div className="bg-white rounded-lg px-2 py-1 text-center shadow-soft border border-slate-100 min-w-[70px]">
        <p className="text-xs font-bold text-slate-700 truncate">{agent.name}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wide truncate">{agent.role}</p>
      </div>
      <div className="w-14 h-8 rounded flex items-center justify-center text-white text-sm" style={{ background: accent }}>
        <MaterialIcon name={icon} className="text-sm" />
      </div>
    </div>
  );
}

export function CommandCentre() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Fetch tasks to derive who is actively working (in_progress only)
    fetch("/api/hq/tasks", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        const activeAgentIds = new Set(data.inProgress.map((t: Agent) => t.assigned_to));
        fetch("/api/hq/agents", { cache: "no-store" })
          .then(r => r.json())
          .then((all: Agent[]) => {
            setAgents(all.filter(a => activeAgentIds.has(a.id)));
          });
      })
      .catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/hq/tasks", { cache: "no-store" }).then(r => r.json()).then(data => {
        const activeAgentIds = new Set(data.inProgress.map((t: Agent) => t.assigned_to));
        fetch("/api/hq/agents", { cache: "no-store" }).then(r => r.json()).then((all: Agent[]) => {
          setAgents(all.filter(a => activeAgentIds.has(a.id)));
        });
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const ordered = AGENT_ORDER.filter(meta => agents.some(a => a.id === meta.id))
    .map(meta => agents.find(a => a.id === meta.id)!);

  return (
    <section className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-700 text-xl font-display font-bold flex items-center gap-2">
          <div className="p-1.5 bg-slate-200 rounded-lg text-slate-600">
            <MaterialIcon name="meeting_room" />
          </div>
          Command Centre
        </h2>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-500 tracking-wide">LIVE</span>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)"
      }}>
        {ordered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
            <MaterialIcon name="nights_stay" className="text-2xl" />
            <p className="text-xs">Office is quiet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 p-4 justify-center items-end h-full">
            {ordered.map(agent => <AgentDesk key={agent.id} agent={agent} />)}
          </div>
        )}
      </div>
    </section>
  );
}
