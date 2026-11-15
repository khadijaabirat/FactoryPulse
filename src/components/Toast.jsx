/**
 * Composant Toast : Affiche une notification flottante temporaire en bas à droite
 * après une action utilisateur (ajout, modification de statut, suppression).
 */
export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  // Couleurs selon le type d'alerte
  const stylesType = {
    success: "bg-emerald-600 text-white shadow-emerald-200",
    info: "bg-blue-600 text-white shadow-blue-200",
    error: "bg-rose-600 text-white shadow-rose-200",
  };

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl transition-all ${
        stylesType[type] || stylesType.info
      }`}
    >
      <span className="text-sm font-semibold">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white font-bold text-xs p-1 cursor-pointer"
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  );
}
