import { useState } from "react";
import MachineCard from "./MachineCard";

export default function MachineList({
  machines = [],
  isLoading,
  error,
  onStatusChange,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("nom-asc");

  const filteredMachines = machines.filter((machine) => {
    const matchesName = machine.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Tous" || machine.statut === statusFilter;
    return matchesName && matchesStatus;
  });

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    if (sortBy === "production-desc") return b.production - a.production;
    if (sortBy === "production-asc") return a.production - b.production;
    if (sortBy === "nom-desc") return b.nom.localeCompare(a.nom);
    return a.nom.localeCompare(b.nom);
  });

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("Tous");
    setSortBy("nom-asc");
  };

  const exportToCSV = () => {
    const entete = "ID,Nom,Zone,Statut,Production\n";
    const lignes = sortedMachines
      .map(
        (m) => `${m.id},"${m.nom}","${m.zone}",${m.statut},${m.production}`
      )
      .join("\n");

    const blob = new Blob([entete + lignes], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "machines-factorypulse.csv";
    lien.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-zinc-500">
          Chargement de l'inventaire des machines...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-zinc-100 border border-zinc-300 rounded-2xl text-zinc-800 text-sm">
        <p className="font-bold">Erreur de chargement :</p>
        <p className="text-xs text-zinc-600 mt-1">{error}</p>
      </div>
    );
  }

  const isFiltered = searchTerm !== "" || statusFilter !== "Tous" || sortBy !== "nom-asc";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              Parc des Équipements
            </h1>
            <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200 tabular-nums">
              {sortedMachines.length} sur {machines.length}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Gestion, recherche et suivi opérationnel des machines de Safi
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl shadow-xs transition cursor-pointer w-fit"
        >
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Exporter en CSV</span>
        </button>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom d'équipement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          />
        </div>

        <div className="relative w-full md:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 appearance-none cursor-pointer transition text-zinc-800"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En fonctionnement">En fonctionnement</option>
            <option value="À l'arrêt">À l'arrêt</option>
            <option value="En panne">En panne</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative w-full md:w-56">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 appearance-none cursor-pointer transition text-zinc-800"
          >
            <option value="nom-asc">Nom (A → Z)</option>
            <option value="nom-desc">Nom (Z → A)</option>
            <option value="production-desc">Production (Décroissante)</option>
            <option value="production-asc">Production (Croissante)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl transition cursor-pointer shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {sortedMachines.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Aucun résultat trouvé</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Aucune machine ne correspond aux critères de filtre appliqués.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition cursor-pointer shadow-sm shadow-amber-400/20"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedMachines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
