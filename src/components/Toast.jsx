export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  const typeConfig = {
    success: {
      dot: "bg-emerald-400",
      icon: (
        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      dot: "bg-rose-400",
      icon: (
        <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      dot: "bg-blue-400",
      icon: (
        <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl shadow-slate-900/20 border border-slate-800 transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-2">
        {current.icon}
        <span className="text-xs font-medium tracking-tight text-slate-100">
          {message}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        aria-label="Fermer"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
