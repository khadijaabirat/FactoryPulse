import { NavLink, Link } from "react-router-dom";

export default function Sidebar() {
  const getNavLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? "bg-amber-400 text-zinc-950 shadow-sm shadow-amber-400/20 font-bold"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
    }`;

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0 z-20">
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2 py-2 group">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shadow-md shadow-amber-400/20">
            <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-white">
                Factory<span className="text-amber-400">Pulse</span>
              </span>
              <span className="text-[10px] font-bold bg-zinc-800 text-amber-400 px-1.5 py-0.5 rounded border border-zinc-700">
                IoT
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium tracking-tight">
              Site Industriel de Safi
            </p>
          </div>
        </Link>

        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Supervision
          </div>

          <NavLink to="/" className={getNavLinkClass}>
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink to="/machines" className={getNavLinkClass}>
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span>Parc des machines</span>
          </NavLink>

          <NavLink to="/kanban" className={getNavLinkClass}>
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>Tableau Kanban</span>
          </NavLink>
        </nav>

        <div className="pt-2">
          <NavLink
            to="/machines/new"
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? "bg-amber-300 text-zinc-950 ring-2 ring-amber-400"
                  : "bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-amber-400/20 hover:shadow-md"
              }`
            }
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nouvelle machine</span>
          </NavLink>
        </div>
      </div>

      <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white truncate">
              Télémétrie en direct
            </p>
            <p className="text-[10px] text-zinc-400 font-medium">
              8 capteurs connectés
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
