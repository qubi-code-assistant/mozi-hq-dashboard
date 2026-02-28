"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Agents", href: "/agents" },
  { label: "Council", href: "/council" },
  { label: "Analytics", href: "#" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap bg-white/95 backdrop-blur-md px-8 py-4 shadow-sm border-b border-slate-200">
      <Link href="/" className="flex items-center gap-4">
        <div className="size-12 flex items-center justify-center bg-exec-dark rounded-xl text-white shadow-lg">
          <MaterialIcon name="apartment" className="text-3xl" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-slate-800 text-2xl font-display font-bold leading-none tracking-tight">
            Mozi <span className="text-exec-accent">HQ</span>
          </h2>
          <span className="text-xs font-body font-bold text-slate-400 uppercase tracking-wider mt-1">
            Executive Command Suite
          </span>
        </div>
      </Link>

      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) && item.href !== "#";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  isActive
                    ? "bg-exec-accent/10 text-exec-accent text-sm font-bold rounded-lg px-4 py-2"
                    : "text-slate-500 hover:text-exec-accent hover:bg-slate-50 transition-all text-sm font-bold rounded-lg px-4 py-2"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <div className="flex items-center gap-4">
          <button className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-full h-10 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all text-xs font-bold tracking-wide border border-slate-200">
            <MaterialIcon name="notifications" className="text-[18px]" />
            <span>NOTICES</span>
          </button>

          <div className="relative group cursor-pointer">
            <div className="size-12 rounded-full ring-2 ring-slate-200 p-0.5 relative overflow-hidden bg-exec-dark shadow-sm flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">
                E
              </span>
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
