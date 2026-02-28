import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { CouncilPanel } from "@/components/council/CouncilPanel";

export default function CouncilPage() {
  return (
    <main className="flex-1 flex flex-col p-8 max-w-[1600px] mx-auto w-full gap-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <MaterialIcon name="forum" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-700">
            Research Council
          </h1>
        </div>
        <p className="text-slate-500 text-sm">
          Multi-LLM perspectives on your research questions
        </p>
      </div>

      <CouncilPanel />
    </main>
  );
}
