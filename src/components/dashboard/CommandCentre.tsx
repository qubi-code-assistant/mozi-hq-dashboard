import { getAllAgents } from "@/lib/db";
import { AGENT_ORDER } from "@/lib/agents";
import { OfficeScene } from "./OfficeScene";
import { AgentDesk } from "./AgentDesk";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import type { Agent } from "@/lib/types";

export async function CommandCentre() {
  const agents = await getAllAgents();

  // Only show agents that are actively working
  const workingAgents = agents.filter((a) => a.status === "working");
  const agentMap = new Map(workingAgents.map((a) => [a.id, a]));

  const ordered = AGENT_ORDER.map((meta) => agentMap.get(meta.id)).filter(
    Boolean
  ) as Agent[];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-slate-700 text-3xl font-display font-bold flex items-center gap-3">
          <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
            <MaterialIcon name="meeting_room" />
          </div>
          Command Centre
        </h2>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <span className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-500 tracking-wide">
            OPERATIONS LIVE
          </span>
        </div>
      </div>

      <OfficeScene>
        {ordered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
            <MaterialIcon name="nights_stay" />
            <p className="font-body text-sm">No agents currently working — office is quiet</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-12 gap-y-10 w-full max-w-6xl pt-12">
            {ordered.map((agent, i) => {
              const col = i % 4;
              const offset = col === 1 || col === 3;
              return (
                <AgentDesk key={agent.id} agent={agent} offset={offset} />
              );
            })}
          </div>
        )}
      </OfficeScene>
    </section>
  );
}
