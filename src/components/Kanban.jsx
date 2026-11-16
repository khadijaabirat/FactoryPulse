import { useState, useEffect } from "react";

export default function Kanban({ machines = [], onStatusChange }) {
  const [draggingCard, setDraggingCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCol, setHoveredCol] = useState(null);

  const colonnes = [
    {
      id: "En fonctionnement",
      titre: "En fonctionnement",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-300/80",
      activeBorder: "border-amber-400 bg-amber-50/50 ring-4 ring-amber-200/60",
      dot: "bg-amber-400",
      prochainsStatuts: ["À l'arrêt", "En panne"],
    },
    {
      id: "À l'arrêt",
      titre: "À l'arrêt",
      badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200",
      activeBorder: "border-zinc-400 bg-zinc-100/60 ring-4 ring-zinc-200/80",
      dot: "bg-zinc-400",
      prochainsStatuts: ["En fonctionnement", "En panne"],
    },
    {
      id: "En panne",
      titre: "En panne",
      badgeClass: "bg-zinc-200 text-zinc-900 border-zinc-300",
      activeBorder: "border-zinc-600 bg-zinc-200/60 ring-4 ring-zinc-300/80",
      dot: "bg-zinc-800",
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            Suivi Kanban des Équipements
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Déplacez une machine par <strong>glisser-déposer</strong> pour mettre à jour son statut opérationnel
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600 font-semibold bg-white px-3 py-1.5 rounded-xl border border-zinc-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Synchronisation automatique</span>
        </div>
      </div>

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
              className={`rounded-2xl p-4 border transition-all min-h-[600px] flex flex-col ${isOver
                  ? col.activeBorder
                  : "bg-zinc-100/70 border-zinc-200/90"
                }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70 mb-3.5 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                  <h3 className="font-bold text-zinc-900 text-xs tracking-tight">
                    {col.titre}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${col.badgeClass} tabular-nums`}
                >
                  {colMachines.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                {colMachines.map((machine) => {
                  const isBeingDragged = draggingCard?.id === machine.id;

                  return (
                    <div
                      key={machine.id}
                      draggable="true"
                      onDragStart={(e) => handleNativeDragStart(e, machine.id)}
                      onPointerDown={(e) => handlePointerDown(e, machine)}
                      className={`bg-white rounded-xl p-4 border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing touch-none group ${isBeingDragged
                          ? "opacity-25 border-dashed border-amber-400 scale-95"
                          : "opacity-100"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2 pointer-events-none">
                        <span className="font-mono text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                          #{String(machine.id).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-medium tracking-tight">
                          {machine.zone}
                        </span>
                      </div>

                      <h4 className="font-bold text-zinc-900 text-xs mt-2 group-hover:text-amber-600 transition-colors pointer-events-none">
                        {machine.nom}
                      </h4>

                      <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 pointer-events-none">
                        <span className="text-zinc-400">Production</span>
                        <span className="font-bold text-zinc-900 tabular-nums">
                          {machine.production} pcs
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-400 font-medium">
                          Déplacer :
                        </span>
                        {col.prochainsStatuts.map((target) => (
                          <button
                            key={target}
                            type="button"
                            onClick={() =>
                              onStatusChange && onStatusChange(machine.id, target)
                            }
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-amber-400 hover:text-zinc-950 text-zinc-700 transition cursor-pointer"
                          >
                            → {target}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {colMachines.length === 0 && (
                  <div className="flex-1 min-h-[140px] border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-xs text-zinc-400 font-medium p-4 text-center pointer-events-none">
                    Déposez une machine ici
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
          className="bg-white rounded-xl p-4 border border-amber-400 shadow-2xl shadow-amber-400/20 opacity-95 transition-transform ring-2 ring-amber-400/30"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
              #{String(draggingCard.id).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              {draggingCard.zone}
            </span>
          </div>
          <h4 className="font-bold text-zinc-900 text-xs mt-1">
            {draggingCard.nom}
          </h4>
          <div className="mt-2 text-[11px] text-amber-700 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Vers : {hoveredCol || "Relâchez sur une colonne"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
