import { useState } from "react";

export default function Kanban({ machines, onStatusChange }) {
  // État pour colorer la colonne au survol pendant le drag
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Définition des 3 colonnes obligatoires du brief
  const columns = [
    {
      id: "En fonctionnement",
      title: "En fonctionnement",
      color: "emerald",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      borderHover: "border-emerald-400 bg-emerald-50/30",
    },
    {
      id: "À l'arrêt",
      title: "À l'arrêt",
      color: "amber",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      borderHover: "border-amber-400 bg-amber-50/30",
    },
    {
      id: "En panne",
      title: "En panne",
      color: "rose",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      borderHover: "border-rose-400 bg-rose-50/30",
    },
  ];

  // 1. Début du glisser-déposer sur une carte
  const handleDragStart = (e, machineId) => {
    e.dataTransfer.setData("text/plain", machineId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  // 2. Autoriser le survol sur une colonne
  const handleDragOver = (e, columnId) => {
    e.preventDefault(); // Obligatoire en HTML5 pour autoriser le drop
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  // 3. Déposer la carte dans la nouvelle colonne
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const machineIdStr = e.dataTransfer.getData("text/plain");
    const machineId = Number(machineIdStr);

    if (machineId && onStatusChange) {
      onStatusChange(machineId, targetStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Vue Kanban des équipements
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Glissez-déposez une machine d'une colonne vers une autre pour modifier son statut en temps réel.
        </p>
      </div>

      {/* Grille des 3 colonnes Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => {
          // Filtrer les machines de cette colonne
          const colMachines = machines.filter((m) => m.statut === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-slate-100/70 rounded-2xl p-4 border-2 transition-all min-h-[500px] flex flex-col ${isOver ? col.borderHover : "border-slate-200/80"
                }`}
            >
              {/* En-tête de la colonne */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {col.title}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${col.badgeClass}`}
                >
                  {colMachines.length}
                </span>
              </div>

              {/* Liste des cartes de machines */}
              <div className="space-y-3 flex-1">
                {colMachines.map((machine) => (
                  <div
                    key={machine.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, machine.id)}
                    className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing select-none"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        #{machine.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {machine.zone}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      {machine.nom}
                    </h4>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Production :</span>
                      <span className="font-bold text-slate-800">
                        {machine.production} pcs
                      </span>
                    </div>
                  </div>
                ))}

                {/* Zone de drop vide si la colonne n'a aucune machine */}
                {colMachines.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                    Déposez une machine ici
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}