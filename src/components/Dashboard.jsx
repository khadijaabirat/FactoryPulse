import StatCard from "./StatCard";
import { Link } from "react-router-dom";

export default function Dashboard({ machines = [], isLoading, error }) {
  const total = machines.length;
  const enFonctionnement = machines.filter(
    (m) => m.statut === "En fonctionnement"
  ).length;
  const aLArret = machines.filter((m) => m.statut === "À l'arrêt").length;
  const enPanne = machines.filter((m) => m.statut === "En panne").length;

  const totalProduction = machines.reduce(
    (somme, m) => somme + (Number(m.production) || 0),
    0
  );

  const tauxDisponibilite = total > 0 ? Math.round((enFonctionnement / total) * 100) : 0;
  const tauxArret = total > 0 ? Math.round((aLArret / total) * 100) : 0;
  const tauxPanne = total > 0 ? Math.round((enPanne / total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-zinc-500">
          Chargement de la télémétrie des machines...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-zinc-100 border border-zinc-300 rounded-2xl text-zinc-800 text-sm">
        <div className="flex items-center gap-2 font-bold">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Erreur de communication</span>
        </div>
        <p className="mt-1 text-xs text-zinc-600 pl-7">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              Supervision de Production
            </h1>

          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Site Industriel de Safi · Suivi opérationnel des 8 équipements majeurs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/machines"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl shadow-xs transition"
          >
            <span>Consulter le parc</span>
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/machines/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm shadow-amber-400/20 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajouter une machine</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total des Équipements"
          value={total}
          color="blue"
          subtitle="Ateliers de Safi"
          badgeText="8 unités"
          icon={
            <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatCard
          title="En Fonctionnement"
          value={enFonctionnement}
          color="yellow"
          subtitle="Capacité active"
          badgeText={`${tauxDisponibilite}%`}
          icon={
            <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="En Panne / Arrêt Critique"
          value={enPanne}
          color="red"
          subtitle={enPanne > 0 ? "Maintenance requise" : "Aucun incident"}
          badgeText={enPanne > 0 ? "Critique" : "OK"}
          icon={
            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                Rendement Journalier de l'Atelier
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cumul des pièces produites sur le quart de travail
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
              Quota 24h
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200/60">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Volume Produit
              </span>
              <p className="text-3xl font-black text-zinc-900 tracking-tight tabular-nums mt-1">
                {totalProduction.toLocaleString()}
                <span className="text-xs font-normal text-zinc-400 ml-1.5">pcs</span>
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Disponibilité Globale
              </span>
              <p className="text-3xl font-black text-amber-500 tracking-tight tabular-nums mt-1">
                {tauxDisponibilite}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500 font-semibold">
              <span>Disponibilité du parc</span>
              <span className="tabular-nums font-bold text-zinc-800">{tauxDisponibilite}%</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${tauxDisponibilite}%` }}
                className="bg-amber-400 transition-all duration-500"
              />
              <div
                style={{ width: `${tauxArret}%` }}
                className="bg-zinc-300 transition-all duration-500"
              />
              <div
                style={{ width: `${tauxPanne}%` }}
                className="bg-zinc-700 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Répartition par Statut Opérationnel
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              État instantané des lignes de production de Safi
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100/60 transition">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-100" />
                <span className="text-xs font-bold text-zinc-800">En fonctionnement</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-900 tabular-nums">{enFonctionnement} machines</span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tabular-nums">{tauxDisponibilite}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100/60 transition">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 ring-4 ring-zinc-200" />
                <span className="text-xs font-bold text-zinc-700">À l'arrêt (Pause / Veille)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-900 tabular-nums">{aLArret} machines</span>
                <span className="text-[10px] font-bold text-zinc-700 bg-zinc-200 px-2 py-0.5 rounded border border-zinc-300 tabular-nums">{tauxArret}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100/60 transition">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 ring-4 ring-zinc-300" />
                <span className="text-xs font-bold text-zinc-700">En panne (Intervention)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-900 tabular-nums">{enPanne} machines</span>
                <span className="text-[10px] font-bold text-zinc-800 bg-zinc-200 px-2 py-0.5 rounded border border-zinc-300 tabular-nums">{tauxPanne}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
