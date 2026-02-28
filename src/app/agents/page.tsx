import { getAllAgents } from "@/lib/db";
import { AGENT_ORDER } from "@/lib/agents";
import { AgentCard } from "@/components/agents/AgentCard";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import type { Agent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const agents = await getAllAgents();
  const agentMap = new Map(agents.map((a) => [a.id, a]));

  // Sort: Mozi first, then by defined order
  const ordered = AGENT_ORDER.map((meta) => agentMap.get(meta.id)).filter(
    Boolean
  ) as Agent[];

  return (
    <main className="flex-1 flex flex-col p-8 max-w-[1600px] mx-auto w-full gap-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
          <MaterialIcon name="groups" />
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-700">
          Agent Directory
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ordered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </main>
  );
}
