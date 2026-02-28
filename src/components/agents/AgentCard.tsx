import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { timeAgo } from "@/lib/utils";
import type { Agent } from "@/lib/types";

export function AgentCard({ agent }: { agent: Agent }) {
  const statusColor =
    agent.status === "working"
      ? "bg-green-100 text-green-700"
      : "bg-slate-100 text-slate-500";

  return (
    <div className="executive-card p-6 flex flex-col items-center text-center gap-3">
      <AgentAvatar agentId={agent.id} name={agent.name} size="lg" />
      <div>
        <h3 className="text-lg font-display font-bold text-slate-800">
          {agent.name}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {agent.role}
        </p>
      </div>
      {agent.specialisation && (
        <p className="text-sm text-slate-500 line-clamp-2">
          {agent.specialisation}
        </p>
      )}
      <div className="flex items-center gap-3 mt-auto pt-2">
        <span className={`status-pill ${statusColor}`}>{agent.status}</span>
        <span className="text-xs text-slate-400">
          {timeAgo(agent.last_heartbeat)}
        </span>
      </div>
    </div>
  );
}
