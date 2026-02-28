import { Suspense } from "react";
import { CommandCentre } from "@/components/dashboard/CommandCentre";
import { ActiveTicketHero } from "@/components/dashboard/ActiveTicketHero";
import { ProjectOperations } from "@/components/dashboard/ProjectOperations";
import { TicketDetailModal } from "@/components/modal/TicketDetailModal";
import { ensureTables } from "@/lib/db";

export const dynamic = "force-dynamic";

function Skeleton() {
  return <div className="executive-card p-6 animate-pulse h-24" />;
}

export default async function DashboardPage() {
  await ensureTables();
  return (
    <>
      <main className="flex-1 flex flex-col gap-2 px-4 py-2 max-w-[1600px] mx-auto w-full min-h-0 overflow-y-auto">
        <Suspense fallback={<Skeleton />}>
          <CommandCentre />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <ActiveTicketHero />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <ProjectOperations />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <TicketDetailModal />
      </Suspense>
    </>
  );
}
