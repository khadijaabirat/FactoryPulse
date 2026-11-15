import { useState } from "react";
import MachineCard from "./MachineCard";

export default function MachineList({ machines, isLoading, error, onStatusChange, onDelete, }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  // 2. Calcul des machines filtrées (SANS modifier la liste originale)
  const filteredMachines = machines.filter((machine) => {
    // Vérification du nom
    const matchesName = machine.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Vérification du statut
    const matchesStatus =
      statusFilter === "Tous" || machine.statut === statusFilter;

    return matchesName && matchesStatus;
  });

  // 3. Fonction pour réinitialiser les filtres
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("Tous");
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
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des machines
          </h1>
          <p className="text-sm text-slate-500">
            {filteredMachines.length} sur {machines.length} machine(s) affichée(s)
          </p>
        </div>
      </div>

      {/* Barre d'outils : Recherche + Filtre + Réinitialisation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
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
        <div className="sm:w-56">
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

        {/* Bouton Réinitialiser */}
        {(searchTerm !== "" || statusFilter !== "Tous") && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Liste des machines OU message aucun résultat */}
      {filteredMachines.length === 0 ? (
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
          {filteredMachines.map((machine) => (
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