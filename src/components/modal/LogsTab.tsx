import { timeAgo } from "@/lib/utils";
import { getAgentAccent } from "@/lib/agents";
import type { Activity } from "@/lib/types";

export function LogsTab({ activity }: { activity: Activity[] }) {
  if (activity.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>No activity logged yet</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg m-4 p-4 font-mono text-xs text-slate-300 h-[400px] overflow-y-auto">
      {activity.map((a) => (
        <div key={a.id} className="mb-1.5 leading-relaxed">
          <span className="text-slate-500">[{timeAgo(a.created_at)}]</span>{" "}
          <span style={{ color: getAgentAccent(a.agent) }}>{a.agent}</span>{" "}
          <span className="text-slate-400">{a.action}</span>
          {a.detail && (
            <span className="text-slate-500"> — {a.detail}</span>
          )}
        </div>
      ))}
    </div>
  );
}
