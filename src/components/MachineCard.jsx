export default function MachineCard({ machine, onStatusChange, onDelete }) {
  const statusStyles = {
    "En fonctionnement": {
      badge: "bg-amber-50 text-amber-900 border-amber-300/80",
      dot: "bg-amber-400",
    },
    "À l'arrêt": {
      badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
      dot: "bg-zinc-400",
    },
    "En panne": {
      badge: "bg-zinc-200 text-zinc-900 border-zinc-300",
      dot: "bg-zinc-800",
    },
  };

  const currentStatus = statusStyles[machine?.statut] || {
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
    dot: "bg-zinc-400",
  };

  const handleDelete = () => {
    const confirme = window.confirm(
      `Confirmer la suppression de la machine "${machine?.nom}" de l'inventaire ?`
    );
    if (confirme && onDelete) {
      onDelete(machine.id);
    }
  };

  if (!machine) return null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between gap-4 group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                #{String(machine.id).padStart(2, "0")}
              </span>
              <span className="text-[11px] font-medium text-zinc-400 tracking-tight">
                {machine.zone}
              </span>
            </div>
            <h3 className="text-sm font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
              {machine.nom}
            </h3>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${currentStatus.badge} shrink-0`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></span>
            {machine.statut}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Production du jour</span>
            <span className="font-bold text-zinc-900 tabular-nums">
              {machine.production}{" "}
              <span className="text-[11px] font-normal text-zinc-400">pièces</span>
            </span>
          </div>

          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              style={{
                width: `${Math.min(100, Math.round((Number(machine.production) / 600) * 100))}%`,
              }}
              className="h-full bg-amber-400 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <select
            value={machine.statut}
            onChange={(e) =>
              onStatusChange && onStatusChange(machine.id, e.target.value)
            }
            className="w-full text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none transition"
          >
            <option value="En fonctionnement">En fonctionnement</option>
            <option value="À l'arrêt">À l'arrêt</option>
            <option value="En panne">En panne</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
          title="Supprimer la machine"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
