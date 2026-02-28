export function OfficeScene({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-[180px] bg-slate-50 rounded-2xl border border-slate-300 overflow-hidden shadow-card">
      {/* Sky + cityscape background */}
      <div className="absolute inset-0 city-view z-0">
        {/* Clouds */}
        <div className="absolute top-10 left-20 w-32 h-12 bg-white/40 rounded-full blur-xl" />
        <div className="absolute top-24 right-40 w-48 h-16 bg-white/30 rounded-full blur-xl" />

        {/* Buildings */}
        <div className="absolute bottom-0 w-full h-full flex items-end justify-center pointer-events-none">
          <div className="building building-back h-64 w-24 left-[10%] absolute" />
          <div className="building building-back h-80 w-32 left-[20%] absolute" />
          <div className="building building-back h-56 w-40 right-[15%] absolute" />
          <div className="building building-back h-96 w-28 right-[30%] absolute" />
          <div className="building building-front h-40 w-full mb-0 absolute bg-gradient-to-t from-slate-300 to-slate-100 opacity-20" />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />

      {/* Desk grid */}
      <div className="absolute inset-0 flex items-center justify-center p-10 z-20">
        {children}
      </div>
    </div>
  );
}
