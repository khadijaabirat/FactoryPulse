import { useState, useEffect } from "react";

/**
 * Composant Kanban : Vue interactive des équipements en 3 colonnes de statuts.
 * Supporte le glisser-déposer fluide à la souris ou pavé tactile (Pointer Drag & Drop)
 * avec une carte flottante visuelle et des boutons de déplacement rapide en 1 clic.
 */
export default function Kanban({ machines = [], onStatusChange }) {
  // Machine actuellement attrapée avec la souris
  const [draggingCard, setDraggingCard] = useState(null);
  // Position actuelle de la souris
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Statut de la colonne actuellement survolée
  const [hoveredCol, setHoveredCol] = useState(null);

  // Configuration des 3 colonnes de l'usine de Safi
  const colonnes = [
    {
      id: "En fonctionnement",
      titre: "En fonctionnement",
      couleurBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bordureSurvol: "border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-200",
      pastille: "bg-emerald-500",
      prochainsStatuts: ["À l'arrêt", "En panne"],
    },
    {
      id: "À l'arrêt",
      titre: "À l'arrêt",
      couleurBadge: "bg-amber-50 text-amber-700 border-amber-200",
      bordureSurvol: "border-amber-500 bg-amber-50/60 ring-4 ring-amber-200",
      pastille: "bg-amber-500",
      prochainsStatuts: ["En fonctionnement", "En panne"],
    },
    {
      id: "En panne",
      titre: "En panne",
      couleurBadge: "bg-rose-50 text-rose-700 border-rose-200",
      bordureSurvol: "border-rose-500 bg-rose-50/60 ring-4 ring-rose-200",
      pastille: "bg-rose-500",
      prochainsStatuts: ["En fonctionnement", "À l'arrêt"],
    },
  ];

  // 1. Début de la saisie d'une carte avec la souris (ou pavé tactile)
  const handlePointerDown = (e, machine) => {
    // Si l'utilisateur clique sur un bouton ou un lien, on ne démarre pas le glisser
    if (e.target.closest("button") || e.target.closest("a")) return;

    setDraggingCard(machine);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // 2. Gestion globale du déplacement et du dépôt dans la fenêtre
  useEffect(() => {
    if (!draggingCard) return;

    // Déplacement : met à jour la position de la carte flottante et détecte la colonne survolée
    const handlePointerMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Détecter l'élément sous le curseur de la souris
      const elementSousCurseur = document.elementFromPoint(e.clientX, e.clientY);
      const colElement = elementSousCurseur?.closest("[data-column-id]");
      if (colElement) {
        setHoveredCol(colElement.getAttribute("data-column-id"));
      } else {
        setHoveredCol(null);
      }
    };

    // Relâchement (Drop) : applique le nouveau statut si la souris est au-dessus d'une colonne
    const handlePointerUp = (e) => {
      const elementSousCurseur = document.elementFromPoint(e.clientX, e.clientY);
      const colElement = elementSousCurseur?.closest("[data-column-id]");
      const statutCible = colElement?.getAttribute("data-column-id");

      if (statutCible && statutCible !== draggingCard.statut && onStatusChange) {
        onStatusChange(draggingCard.id, statutCible);
      }

      setDraggingCard(null);
      setHoveredCol(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingCard, onStatusChange]);

  // Support supplémentaire du Drag & Drop HTML5 natif
  const handleNativeDragStart = (e, machineId) => {
    e.dataTransfer.setData("text/plain", String(machineId));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleNativeDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoveredCol !== colId) setHoveredCol(colId);
  };

  const handleNativeDrop = (e, statutCible) => {
    e.preventDefault();
    setHoveredCol(null);
    const rawId = e.dataTransfer.getData("text/plain");
    if (!rawId) return;
    const machineId = Number(rawId);
    const machine = machines.find((m) => m.id === machineId);
    if (machine && machine.statut !== statutCible && onStatusChange) {
      onStatusChange(machineId, statutCible);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* En-tête de la vue Kanban */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau Kanban des équipements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            <strong>Cliquez et glissez une carte avec la souris</strong> vers une autre colonne pour changer son statut.
          </p>
        </div>
      </div>

      {/* Grille des 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {colonnes.map((col) => {
          const machinesColonne = machines.filter((m) => m.statut === col.id);
          const estSurvolee = hoveredCol === col.id;

          return (
            <div
              key={col.id}
              data-column-id={col.id}
              onDragOver={(e) => handleNativeDragOver(e, col.id)}
              onDrop={(e) => handleNativeDrop(e, col.id)}
              className={`rounded-2xl p-4 border-2 transition-all min-h-[580px] flex flex-col ${
                estSurvolee
                  ? col.bordureSurvol
                  : "bg-slate-100/70 border-slate-200/80"
              }`}
            >
              {/* En-tête de colonne */}
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

              {/* Zone des cartes de la colonne */}
              <div className="space-y-3 flex-1 flex flex-col">
                {machinesColonne.map((machine) => {
                  const estEnCoursDeGlissement = draggingCard?.id === machine.id;

                  return (
                    <div
                      key={machine.id}
                      draggable="true"
                      onDragStart={(e) => handleNativeDragStart(e, machine.id)}
                      onPointerDown={(e) => handlePointerDown(e, machine)}
                      className={`bg-white rounded-xl p-4 border border-slate-200 shadow-sm transition hover:shadow-md cursor-grab active:cursor-grabbing touch-none ${
                        estEnCoursDeGlissement
                          ? "opacity-30 border-dashed border-blue-400 scale-95"
                          : "opacity-100"
                      }`}
                    >
                      {/* En-tête de la carte (ID et Atelier) */}
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

                      {/* Boutons d'action rapide */}
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
                  );
                })}

                {/* Message d'aide si la colonne est vide */}
                {machinesColonne.length === 0 && (
                  <div className="flex-1 min-h-[140px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium p-4 text-center pointer-events-none">
                    Glissez et déposez une machine ici
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Carte flottante qui suit visiblement la souris lors du glissement */}
      {draggingCard && (
        <div
          id="floating-card"
          style={{
            position: "fixed",
            left: `${mousePos.x - 140}px`,
            top: `${mousePos.y - 35}px`,
            width: "280px",
            pointerEvents: "none",
            zIndex: 99999,
            transform: "rotate(2.5deg) scale(1.05)",
          }}
          className="bg-white rounded-xl p-4 border-2 border-blue-500 shadow-2xl opacity-95 transition-transform"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold text-slate-400">
              #{draggingCard.id}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {draggingCard.zone}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm mt-1">
            {draggingCard.nom}
          </h4>
          <div className="mt-2 text-xs text-blue-600 font-semibold flex items-center gap-1">
            <span>↳</span>
            <span>Cible : {hoveredCol || "Survolez une colonne"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
