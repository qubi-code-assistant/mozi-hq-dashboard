import { Suspense } from "react";
import { CommandCentre } from "@/components/dashboard/CommandCentre";
import { ActiveTicketHero } from "@/components/dashboard/ActiveTicketHero";
import { ProjectOperations } from "@/components/dashboard/ProjectOperations";
import { TicketDetailModal } from "@/components/modal/TicketDetailModal";

export const dynamic = "force-dynamic";

function LoadingSkeleton() {
  return (
    <div className="executive-card p-8 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <main className="flex-1 flex flex-col p-8 max-w-[1600px] mx-auto w-full gap-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <CommandCentre />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <ActiveTicketHero />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <ProjectOperations />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <TicketDetailModal />
      </Suspense>
    </>
  );
}
