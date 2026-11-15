import { useState, useEffect } from "react";

export default function Kanban({ machines = [], onStatusChange }) {
  const [draggingCard, setDraggingCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCol, setHoveredCol] = useState(null);

  const colonnes = [
    {
      id: "En fonctionnement",
      titre: "En fonctionnement",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      activeBorder: "border-emerald-500 bg-emerald-50/40 ring-4 ring-emerald-100/70",
      dot: "bg-emerald-500",
      prochainsStatuts: ["À l'arrêt", "En panne"],
    },
    {
      id: "À l'arrêt",
      titre: "À l'arrêt",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
      activeBorder: "border-amber-500 bg-amber-50/40 ring-4 ring-amber-100/70",
      dot: "bg-amber-500",
      prochainsStatuts: ["En fonctionnement", "En panne"],
    },
    {
      id: "En panne",
      titre: "En panne",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-200/80",
      activeBorder: "border-rose-500 bg-rose-50/40 ring-4 ring-rose-100/70",
      dot: "bg-rose-500",
      prochainsStatuts: ["En fonctionnement", "À l'arrêt"],
    },
  ];

  const handlePointerDown = (e, machine) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    setDraggingCard(machine);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!draggingCard) return;

    const handlePointerMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const colEl = element?.closest("[data-column-id]");
      if (colEl) {
        setHoveredCol(colEl.getAttribute("data-column-id"));
      } else {
        setHoveredCol(null);
      }
    };

    const handlePointerUp = (e) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const colEl = element?.closest("[data-column-id]");
      const statutCible = colEl?.getAttribute("data-column-id");

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

  // Support Drag & Drop HTML5 natif
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
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Suivi Kanban des Équipements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Déplacez une machine par <strong>glisser-déposer</strong> pour mettre à jour son statut opérationnel
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Synchronisation automatique</span>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {colonnes.map((col) => {
          const colMachines = machines.filter((m) => m.statut === col.id);
          const isOver = hoveredCol === col.id;

          return (
            <div
              key={col.id}
              data-column-id={col.id}
              onDragOver={(e) => handleNativeDragOver(e, col.id)}
              onDrop={(e) => handleNativeDrop(e, col.id)}
              className={`rounded-2xl p-4 border transition-all min-h-[600px] flex flex-col ${
                isOver
                  ? col.activeBorder
                  : "bg-slate-100/60 border-slate-200/80"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3.5 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                  <h3 className="font-bold text-slate-900 text-xs tracking-tight">
                    {col.titre}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${col.badgeClass} tabular-nums`}
                >
                  {colMachines.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 flex flex-col">
                {colMachines.map((machine) => {
                  const isBeingDragged = draggingCard?.id === machine.id;

                  return (
                    <div
                      key={machine.id}
                      draggable="true"
                      onDragStart={(e) => handleNativeDragStart(e, machine.id)}
                      onPointerDown={(e) => handlePointerDown(e, machine)}
                      className={`bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing touch-none group ${
                        isBeingDragged
                          ? "opacity-25 border-dashed border-blue-400 scale-95"
                          : "opacity-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 pointer-events-none">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{String(machine.id).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                          {machine.zone}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs mt-2 group-hover:text-blue-600 transition-colors pointer-events-none">
                        {machine.nom}
                      </h4>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 pointer-events-none">
                        <span className="text-slate-400">Production</span>
                        <span className="font-bold text-slate-800 tabular-nums">
                          {machine.production} pcs
                        </span>
                      </div>

                      {/* Quick Move Buttons */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Déplacer :
                        </span>
                        {col.prochainsStatuts.map((target) => (
                          <button
                            key={target}
                            type="button"
                            onClick={() =>
                              onStatusChange && onStatusChange(machine.id, target)
                            }
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 transition cursor-pointer"
                          >
                            → {target}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {colMachines.length === 0 && (
                  <div className="flex-1 min-h-[140px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium p-4 text-center pointer-events-none">
                    Déposez une machine ici
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Card during active Pointer Drag */}
      {draggingCard && (
        <div
          id="floating-card"
          style={{
            position: "fixed",
            left: `${mousePos.x - 130}px`,
            top: `${mousePos.y - 35}px`,
            width: "260px",
            pointerEvents: "none",
            zIndex: 99999,
            transform: "rotate(2deg) scale(1.03)",
          }}
          className="bg-white rounded-xl p-4 border border-blue-500 shadow-2xl shadow-blue-500/15 opacity-95 transition-transform ring-2 ring-blue-500/20"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              #{String(draggingCard.id).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {draggingCard.zone}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 text-xs mt-1">
            {draggingCard.nom}
          </h4>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>Vers : {hoveredCol || "Relâchez sur une colonne"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
