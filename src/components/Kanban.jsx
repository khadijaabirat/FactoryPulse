import { useState, useRef } from "react";

/**
 * Composant Kanban : Affichage des équipements en 3 colonnes de statuts.
 * Supporte le Glisser-Déposer (Drag & Drop) natif HTML5 complet avec la souris
 * ainsi que des boutons de déplacement rapide en 1 clic.
 */
export default function Kanban({ machines = [], onStatusChange }) {
  // Référence pour garder l'identifiant de la machine en cours de glissement
  const machineEnGlissement = useRef(null);

  // État pour colorer la colonne actuellement survolée
  const [colonneSurvolee, setColonneSurvolee] = useState(null);

  // Configuration des 3 colonnes de production de l'usine
  const colonnes = [
    {
      id: "En fonctionnement",
      titre: "En fonctionnement",
      couleurBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bordureSurvol: "border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-100",
      pastille: "bg-emerald-500",
      prochainsStatuts: ["À l'arrêt", "En panne"],
    },
    {
      id: "À l'arrêt",
      titre: "À l'arrêt",
      couleurBadge: "bg-amber-50 text-amber-700 border-amber-200",
      bordureSurvol: "border-amber-500 bg-amber-50/50 ring-4 ring-amber-100",
      pastille: "bg-amber-500",
      prochainsStatuts: ["En fonctionnement", "En panne"],
    },
    {
      id: "En panne",
      titre: "En panne",
      couleurBadge: "bg-rose-50 text-rose-700 border-rose-200",
      bordureSurvol: "border-rose-500 bg-rose-50/50 ring-4 ring-rose-100",
      pastille: "bg-rose-500",
      prochainsStatuts: ["En fonctionnement", "À l'arrêt"],
    },
  ];

  // 1. Quand l'utilisateur clique et commence à glisser la carte avec la souris
  const handleDragStart = (e, machineId) => {
    machineEnGlissement.current = machineId;
    e.dataTransfer.setData("text/plain", String(machineId));
    e.dataTransfer.setData("text", String(machineId));
    e.dataTransfer.effectAllowed = "move";
  };

  // 2. Quand la souris survole une colonne ou une carte (OBLIGATOIRE : e.preventDefault autorise le dépôt)
  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (colonneSurvolee !== colId) {
      setColonneSurvolee(colId);
    }
  };

  // 3. Quand la souris quitte la colonne
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setColonneSurvolee(null);
    }
  };

  // 4. Fin du glissement (au cas où l'utilisateur relâche hors zone)
  const handleDragEnd = () => {
    machineEnGlissement.current = null;
    setColonneSurvolee(null);
  };

  // 5. Quand l'utilisateur relâche la souris pour déposer la carte dans la colonne cible
  const handleDrop = (e, statutCible) => {
    e.preventDefault();
    e.stopPropagation();
    setColonneSurvolee(null);

    // Récupération de l'identifiant (soit via le dataTransfer HTML5, soit via la référence)
    const idTexte = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text");
    const machineId = idTexte ? Number(idTexte) : machineEnGlissement.current;

    machineEnGlissement.current = null;

    if (!machineId) return;

    // Trouver la machine correspondante
    const machine = machines.find((m) => m.id === machineId);

    // Si la machine change réellement de statut, on notifie le parent
    if (machine && machine.statut !== statutCible && onStatusChange) {
      onStatusChange(machineId, statutCible);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau Kanban des équipements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            <strong>Glissez une carte avec la souris</strong> vers une autre colonne ou cliquez sur un <strong>bouton d'action rapide</strong> pour changer son statut.
          </p>
        </div>
      </div>

      {/* Grille des 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {colonnes.map((col) => {
          // Filtrer les machines de cette colonne
          const machinesColonne = machines.filter((m) => m.statut === col.id);
          const estSurvolee = colonneSurvolee === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragEnter={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl p-4 border-2 transition-all min-h-[580px] flex flex-col ${
                estSurvolee
                  ? col.bordureSurvol
                  : "bg-slate-100/70 border-slate-200/80"
              }`}
            >
              {/* En-tête de la colonne */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-4 pointer-events-none">
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

              {/* Conteneur des cartes (aussi zone de dépôt) */}
              <div
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className="space-y-3 flex-1 flex flex-col"
              >
                {machinesColonne.map((machine) => (
                  <div
                    key={machine.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, machine.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm transition hover:shadow-md cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* ID et Zone */}
                    <div className="flex items-start justify-between gap-2 pointer-events-none">
                      <span className="text-xs font-bold text-slate-400">
                        #{machine.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {machine.zone}
                      </span>
                    </div>

                    {/* Nom de la machine */}
                    <h4 className="font-bold text-slate-900 text-sm mt-1 pointer-events-none">
                      {machine.nom}
                    </h4>

                    {/* Production journalière */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 pointer-events-none">
                      <span>Production :</span>
                      <span className="font-bold text-slate-800">
                        {machine.production} pcs
                      </span>
                    </div>

                    {/* Boutons rapides pour déplacer en 1 clic */}
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

                {/* Zone de drop vide si la colonne n'a aucune machine */}
                {machinesColonne.length === 0 && (
                  <div
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="flex-1 min-h-[140px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium p-4 text-center"
                  >
                    Glissez et déposez une machine ici avec la souris
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
