import StatCard from "./StatCard";
import { Link } from "react-router-dom";

/**
 * Composant Dashboard : Vue principale avec les 3 indicateurs clés (KPIs) en temps réel,
 * le volume de production du jour et la répartition par statut.
 */
export default function Dashboard({ machines = [], isLoading, error }) {
  // 1. Calculs des indicateurs obligatoires du cahier des charges
  const total = machines.length;

  const enFonctionnement = machines.filter(
    (m) => m.statut === "En fonctionnement"
  ).length;

  const enPanne = machines.filter(
    (m) => m.statut === "En panne"
  ).length;

  const aLArret = machines.filter(
    (m) => m.statut === "À l'arrêt"
  ).length;

  // Calcul bonus : Total des pièces produites dans la journée
  const totalProduction = machines.reduce(
    (somme, m) => somme + (Number(m.production) || 0),
    0
  );

  // Taux de disponibilité opérationnelle en pourcentage
  const tauxFonctionnement = total > 0 ? Math.round((enFonctionnement / total) * 100) : 0;

  // 2. Gestion de l'état de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">
          Calcul des indicateurs du tableau de bord...
        </p>
      </div>
    );
  }

  // 3. Gestion de l'état d'erreur
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl">
        <p className="font-bold">Erreur de chargement :</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec titre et raccourcis d'action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord de production
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi en temps réel des équipements industriels — Usine de Safi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/machines"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-sm transition"
          >
            Voir les machines
          </Link>
          <Link
            to="/machines/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Nouvelle machine</span>
          </Link>
        </div>
      </div>

      {/* Les 3 indicateurs obligatoires du brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 : Total des machines */}
        <StatCard
          title="Total des machines"
          value={total}
          color="blue"
          subtitle="Équipements enregistrés"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        {/* KPI 2 : Machines en fonctionnement */}
        <StatCard
          title="Machines en fonctionnement"
          value={enFonctionnement}
          color="green"
          subtitle={`${tauxFonctionnement}% des équipements actifs`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* KPI 3 : Machines en panne */}
        <StatCard
          title="Machines en panne"
          value={enPanne}
          color="red"
          subtitle={enPanne > 0 ? "Maintenance requise" : "Aucune panne signalée"}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Sections récapitulatives : Production totale et Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance du jour */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Performance de production du jour
          </h3>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-xs font-medium text-slate-500">Volume total produit</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {totalProduction.toLocaleString()}{" "}
                <span className="text-sm font-normal text-slate-500">pièces</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500">Disponibilité</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {tauxFonctionnement}%
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            💡 Les indicateurs sont actualisés instantanément dès qu'une machine change de statut ou est modifiée.
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Répartition des équipements
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                En fonctionnement
              </span>
              <span className="font-bold text-slate-900">{enFonctionnement} machines</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                À l'arrêt
              </span>
              <span className="font-bold text-slate-900">{aLArret} machines</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                En panne
              </span>
              <span className="font-bold text-slate-900">{enPanne} machines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
