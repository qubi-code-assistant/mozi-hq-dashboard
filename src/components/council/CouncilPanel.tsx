"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

const COUNCIL_MEMBERS = [
  { name: "Claude", org: "Anthropic", accent: "#8B5CF6", icon: "psychology" },
  { name: "Gemini", org: "Google", accent: "#3B82F6", icon: "auto_awesome" },
  { name: "GPT-4", org: "OpenAI", accent: "#10B981", icon: "smart_toy" },
  { name: "Perplexity", org: "Perplexity", accent: "#F59E0B", icon: "travel_explore" },
];

export function CouncilPanel() {
  const [showToast, setShowToast] = useState(false);

  function handleConvene() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Input card */}
      <div className="executive-card p-6">
        <textarea
          placeholder="Ask the council a research question..."
          className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-exec-accent/50 focus:border-exec-accent"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleConvene}
            className="px-6 py-3 rounded-lg bg-exec-dark text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <MaterialIcon name="groups" className="text-lg" />
            Convene Council
          </button>
        </div>
      </div>

      {/* Council members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COUNCIL_MEMBERS.map((member) => (
          <div key={member.name} className="executive-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="size-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: member.accent }}
              >
                <MaterialIcon name={member.icon} className="text-2xl" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-800">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-400">{member.org}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 italic">
              Awaiting question...
            </p>
          </div>
        ))}
      </div>

      {/* Synthesis card */}
      <div className="executive-card p-6">
        <h3 className="font-display font-bold text-slate-700 text-lg mb-3 flex items-center gap-2">
          <MaterialIcon name="merge_type" className="text-exec-accent" />
          Council Synthesis
        </h3>
        <p className="text-sm text-slate-400">
          Responses will be synthesised here once the council is convened.
        </p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-exec-dark text-white px-6 py-3 rounded-lg shadow-card text-sm font-bold animate-bounce z-50">
          Coming soon
        </div>
      )}
    </div>
  );
}
