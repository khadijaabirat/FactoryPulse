export default function MachineCard({ machine, onStatusChange, onDelete }) {
  const statusStyles = {
    "En fonctionnement": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "À l'arrêt": "bg-amber-50 text-amber-700 border-amber-200",
    "En panne": "bg-rose-50 text-rose-700 border-rose-200",
  };

  const handleDelete = () => {
    const confirme = window.confirm(
      `Voulez-vous vraiment supprimer la machine "${machine?.nom}" ?`
    );
    if (confirme && onDelete) {
      onDelete(machine.id);
    }
  };

  if (!machine) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400">#{machine.id}</span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {machine.nom}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{machine.zone}</p>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[machine.statut] ||
              "bg-slate-100 text-slate-700 border-slate-200"
              }`}
          >
            {machine.statut}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Production du jour :</span>
          <span className="font-bold text-slate-900 text-sm">
            {machine.production}{" "}
            <span className="text-xs font-normal text-slate-400">pièces</span>
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <select
          value={machine.statut}
          onChange={(e) =>
            onStatusChange && onStatusChange(machine.id, e.target.value)
          }
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="En fonctionnement">En fonctionnement</option>
          <option value="À l'arrêt">À l'arrêt</option>
          <option value="En panne">En panne</option>
        </select>

        <button
          type="button"
          onClick={handleDelete}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
