import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { getAgentAccent, getAgentIcon } from "@/lib/agents";
import type { Agent } from "@/lib/types";

export function AgentDesk({
  agent,
  offset,
}: {
  agent: Agent;
  offset: boolean;
}) {
  const accent = getAgentAccent(agent.id);
  const icon = getAgentIcon(agent.id);
  const isWorking = agent.status === "working";
  const initial = agent.name.charAt(0).toUpperCase();

  return (
    <div className={`desk-block flex flex-col items-center group ${offset ? "mt-10" : ""}`}>
      {/* Desk */}
      <div
        className="relative w-36 h-[5.5rem] rounded-xl shadow-desk flex flex-col items-center justify-center border-b-4 border-black/30"
        style={{
          backgroundColor: isWorking ? accent : "#3A3F47",
          boxShadow: isWorking
            ? `0 0 20px ${accent}40, 0 20px 25px -5px rgba(0,0,0,0.2)`
            : undefined,
        }}
      >
        {/* Avatar above desk */}
        <div
          className="absolute -top-10 size-16 rounded-full glass-frame p-0.5 flex items-center justify-center"
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center font-display font-bold text-white text-xl"
            style={{ backgroundColor: accent }}
          >
            {initial}
          </div>
        </div>

        {/* Monitor */}
        <div className="mt-6 w-20 h-12 rounded border border-slate-600 flex items-center justify-center overflow-hidden shadow-sm bg-slate-800">
          {isWorking ? (
            <div className="text-[6px] text-green-400 font-mono leading-tight px-1">
              &gt; working...<br />&gt; {agent.role.toLowerCase()}
            </div>
          ) : (
            <MaterialIcon
              name={icon}
              className="text-slate-500 text-base"
            />
          )}
        </div>
      </div>

      {/* Name card */}
      <div className="mt-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
        <p className="text-sm font-display font-bold text-slate-800">
          {agent.name}
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {agent.role}
        </p>
      </div>
    </div>
  );
}
