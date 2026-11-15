import { useState } from "react";
import MachineCard from "./MachineCard";

/**
 * Composant MachineList : Affiche la liste complète des machines avec recherche,
 * filtrage par statut, tri dynamique et exportation en fichier CSV.
 */
export default function MachineList({
  machines = [],
  isLoading,
  error,
  onStatusChange,
  onDelete,
}) {
  // 1. États pour la recherche, le filtre et le tri
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("nom-asc");

  // 2. Filtrer les machines selon le texte recherché et le statut sélectionné
  const machinesFiltrees = machines.filter((machine) => {
    const correspondNom = machine.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const correspondStatut =
      statusFilter === "Tous" || machine.statut === statusFilter;

    return correspondNom && correspondStatut;
  });

  // 3. Trier les machines filtrées (FCTRPLS-19)
  const machinesTriees = [...machinesFiltrees].sort((a, b) => {
    if (sortBy === "production-desc") return b.production - a.production;
    if (sortBy === "production-asc") return a.production - b.production;
    if (sortBy === "nom-desc") return b.nom.localeCompare(a.nom);
    return a.nom.localeCompare(b.nom);
  });

  // 4. Réinitialiser la recherche et tous les filtres
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("Tous");
    setSortBy("nom-asc");
  };

  // 5. Exporter les machines affichées au format CSV (FCTRPLS-18)
  const exporterCSV = () => {
    const entete = "ID,Nom,Zone,Statut,Production\n";
    const lignes = machinesTriees
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

  // 6. Gestion du chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">
          Chargement des équipements de l'usine...
        </p>
      </div>
    );
  }

  // 7. Gestion des erreurs
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl">
        <p className="font-bold">Erreur de chargement :</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec titre, compteur et bouton d'export CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des machines
          </h1>
          <p className="text-sm text-slate-500">
            {machinesTriees.length} sur {machines.length} machine(s) affichée(s)
          </p>
        </div>

        {/* Bouton Exporter CSV */}
        <button
          onClick={exporterCSV}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm w-fit cursor-pointer"
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

        {/* Sélecteur de tri dynamique */}
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

        {/* Bouton Réinitialiser (visible si au moins un filtre est actif) */}
        {(searchTerm !== "" || statusFilter !== "Tous" || sortBy !== "nom-asc") && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition whitespace-nowrap cursor-pointer"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grille des machines OU Message d'état vide */}
      {machinesTriees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-base font-semibold text-slate-700">
            Aucun résultat disponible
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Aucune machine ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition cursor-pointer"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinesTriees.map((machine) => (
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
