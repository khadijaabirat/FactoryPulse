import { useState } from "react";
import MachineCard from "./MachineCard";

export default function MachineList({
  machines,
  isLoading,
  error,
  onStatusChange,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("nom-asc");

  // 1. Filtrer les machines selon la recherche et le statut
  const filteredMachines = machines.filter((machine) => {
    const matchesName = machine.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Tous" || machine.statut === statusFilter;

    return matchesName && matchesStatus;
  });

  // 2. Trier les machines filtrées (FCTRPLS-19)
  const sortedMachines = [...filteredMachines].sort((a, b) => {
    if (sortBy === "production-desc") return b.production - a.production;
    if (sortBy === "production-asc") return a.production - b.production;
    if (sortBy === "nom-desc") return b.nom.localeCompare(a.nom);
    return a.nom.localeCompare(b.nom);
  });

  // 3. Réinitialiser la recherche, les filtres et le tri
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("Tous");
    setSortBy("nom-asc");
  };

  // 4. Exporter la liste actuelle en CSV (FCTRPLS-18)
  const exportToCSV = () => {
    const entetes = "ID,Nom,Zone,Statut,Production\n";
    const lignes = sortedMachines
      .map(
        (m) => `${m.id},"${m.nom}","${m.zone}",${m.statut},${m.production}`
      )
      .join("\n");

    const fichier = new Blob([entetes + lignes], {
      type: "text/csv;charset=utf-8;",
    });
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(fichier);
    lien.download = "machines-factorypulse.csv";
    lien.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">
          Chargement des équipements de l'usine...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl">
        <p className="font-bold">Erreur :</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et bouton Exporter CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des machines
          </h1>
          <p className="text-sm text-slate-500">
            {sortedMachines.length} sur {machines.length} machine(s) affichée(s)
          </p>
        </div>

        {/* Bouton Exporter CSV */}
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm w-fit"
        >
          <span>📥</span>
          <span>Exporter en CSV</span>
        </button>
      </div>

      {/* Barre d'outils : Recherche + Filtre Statut + Tri dynamique + Réinitialisation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Champ de recherche */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher une machine par son nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtre par statut */}
        <div className="md:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En fonctionnement">En fonctionnement</option>
            <option value="À l'arrêt">À l'arrêt</option>
            <option value="En panne">En panne</option>
          </select>
        </div>

        {/* Sélecteur de tri dynamique (FCTRPLS-19) */}
        <div className="md:w-56">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="nom-asc">Trier : Nom (A → Z)</option>
            <option value="nom-desc">Trier : Nom (Z → A)</option>
            <option value="production-desc">Trier : Production (Plus élevée)</option>
            <option value="production-asc">Trier : Production (Moins élevée)</option>
          </select>
        </div>

        {/* Bouton Réinitialiser */}
        {(searchTerm !== "" || statusFilter !== "Tous" || sortBy !== "nom-asc") && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition whitespace-nowrap"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Liste des machines OU message aucun résultat */}
      {sortedMachines.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-base font-semibold text-slate-700">
            Aucun résultat disponible
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Aucune machine ne correspond à votre recherche "{searchTerm}".
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
