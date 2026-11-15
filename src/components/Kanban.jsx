import { useState } from "react";

export default function Kanban({ machines = [], onStatusChange }) {
  // État pour savoir quelle colonne est actuellement survolée
  const [dragOverCol, setDragOverCol] = useState(null);

  // Configuration des 3 colonnes de statuts de l'usine
  const colonnes = [
    {
      id: "En fonctionnement",
      titre: "En fonctionnement",
      couleurBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      couleurBordure: "border-emerald-500 bg-emerald-50/40",
      pastille: "bg-emerald-500",
      prochainsStatuts: ["À l'arrêt", "En panne"],
    },
    {
      id: "À l'arrêt",
      titre: "À l'arrêt",
      couleurBadge: "bg-amber-50 text-amber-700 border-amber-200",
      couleurBordure: "border-amber-500 bg-amber-50/40",
      pastille: "bg-amber-500",
      prochainsStatuts: ["En fonctionnement", "En panne"],
    },
    {
      id: "En panne",
      titre: "En panne",
      couleurBadge: "bg-rose-50 text-rose-700 border-rose-200",
      couleurBordure: "border-rose-500 bg-rose-50/40",
      pastille: "bg-rose-500",
      prochainsStatuts: ["En fonctionnement", "À l'arrêt"],
    },
  ];

  // 1. Début du glisser : on stocke l'ID de la machine dans le transfert de données HTML5
  const handleDragStart = (e, machineId) => {
    e.dataTransfer.setData("text/plain", machineId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  // 2. Survol de la zone de dépôt (e.preventDefault() est INDISPENSABLE en HTML5 pour autoriser le drop)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // 3. Entrée dans une colonne (activation visuelle)
  const handleDragEnter = (colId) => {
    setDragOverCol(colId);
  };

  // 4. Sortie d'une colonne (désactivation visuelle)
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverCol(null);
    }
  };

  // 5. Dépôt de la carte dans une colonne cible
  const handleDrop = (e, statutCible) => {
    e.preventDefault();
    setDragOverCol(null);

    const machineIdStr = e.dataTransfer.getData("text/plain");
    if (!machineIdStr) return;

    const machineId = Number(machineIdStr);
    const machine = machines.find((m) => m.id === machineId);

    // On met à jour le statut uniquement s'il est différent
    if (machine && machine.statut !== statutCible && onStatusChange) {
      onStatusChange(machineId, statutCible);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau Kanban des équipements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Déplacez une machine par <strong>glisser-déposer</strong> ou utilisez les <strong>boutons rapides</strong> pour changer son statut.
          </p>
        </div>
      </div>

      {/* Grille des 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {colonnes.map((col) => {
          // Filtrer les machines appartenant à cette colonne
          const machinesColonne = machines.filter((m) => m.statut === col.id);
          const estSurvolee = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl p-4 border-2 transition-all min-h-[550px] flex flex-col ${
                estSurvolee
                  ? `${col.couleurBordure} ring-4 ring-blue-100`
                  : "bg-slate-100/70 border-slate-200/80"
              }`}
            >
              {/* En-tête de la colonne avec titre et compteur */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.pastille}`}></span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {col.titre}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${col.couleurBadge}`}
                >
                  {machinesColonne.length}
                </span>
              </div>

              {/* Zone des cartes */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="space-y-3 flex-1 flex flex-col"
              >
                {machinesColonne.map((machine) => (
                  <div
                    key={machine.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, machine.id)}
                    onDragOver={handleDragOver}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm transition hover:shadow-md cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* ID et Zone */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        #{machine.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {machine.zone}
                      </span>
                    </div>

                    {/* Nom de la machine */}
                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      {machine.nom}
                    </h4>

                    {/* Production journalière */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Production :</span>
                      <span className="font-bold text-slate-800">
                        {machine.production} pcs
                      </span>
                    </div>

                    {/* Boutons rapides en 1 clic pour changer de statut facilement */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Déplacer vers :
                      </span>
                      {col.prochainsStatuts.map((statutCible) => (
                        <button
                          key={statutCible}
                          type="button"
                          onClick={() =>
                            onStatusChange && onStatusChange(machine.id, statutCible)
                          }
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition cursor-pointer"
                        >
                          → {statutCible}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Message si la colonne est vide */}
                {machinesColonne.length === 0 && (
                  <div className="flex-1 min-h-[140px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium p-4 text-center">
                    Glissez une machine ici
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
