import { Suspense } from "react";
import { CommandCentre } from "@/components/dashboard/CommandCentre";
import { ActiveTicketHero } from "@/components/dashboard/ActiveTicketHero";
import { ProjectOperations } from "@/components/dashboard/ProjectOperations";
import { TicketDetailModal } from "@/components/modal/TicketDetailModal";
import { ensureTables } from "@/lib/db";

export const dynamic = "force-dynamic";

function Skeleton() {
  return <div className="executive-card p-4 animate-pulse h-20" />;
}

export default async function DashboardPage() {
  await ensureTables();
  return (
    <>
      <main className="flex-1 flex flex-col gap-2 px-4 py-2 max-w-[1600px] mx-auto w-full min-h-0 overflow-y-auto">

        {/* Active ticket — full width, slim */}
        <Suspense fallback={<Skeleton />}>
          <ActiveTicketHero />
        </Suspense>

        {/* Command Centre + Kanban side by side */}
        <div className="flex gap-3 flex-1 min-h-0">
          {/* Left: Command Centre — 35% */}
          <div className="w-[35%] min-w-0 flex-shrink-0">
            <Suspense fallback={<Skeleton />}>
              <CommandCentre />
            </Suspense>
          </div>

          {/* Right: Project Operations — 65% */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<Skeleton />}>
              <ProjectOperations />
            </Suspense>
          </div>
        </div>

      </main>
      <Suspense fallback={null}>
        <TicketDetailModal />
      </Suspense>
    </>
  );
}
