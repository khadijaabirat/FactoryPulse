import { NavLink, Link } from "react-router-dom";

export default function Sidebar() {
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
      ? "bg-blue-600 text-white shadow-sm font-semibold"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2 py-3 hover:opacity-90 transition" >
          <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base font-black shadow-sm">
            FP
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Factory<span className="text-blue-600">Pulse</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Usine de Safi</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1.5">
          <NavLink to="/" className={getLinkClass}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink to="/machines" className={getLinkClass}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Machines</span>
          </NavLink>

          <NavLink to="/kanban" className={getLinkClass}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"  >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <span>Kanban</span>
          </NavLink>

          <NavLink to="/machines/new"
            className={({ isActive }) =>
              `mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                ? "bg-blue-700 text-white shadow-md ring-2 ring-blue-300"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajouter machine</span>
          </NavLink>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 px-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              Système opérationnel
            </p>
            <p className="text-[11px] text-slate-400">Ateliers de Safi</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
