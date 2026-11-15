export default function Toast({ message, type = "info", onClose }) {
    if (!message) return null;

    // Couleurs selon le type de message
    const styles = {
        success: "bg-emerald-600 text-white",
        info: "bg-blue-600 text-white",
        error: "bg-rose-600 text-white",
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all transform animate-bounce ${styles[type] || styles.info
                }`}
        >
            <span className="text-sm font-semibold">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 text-white/80 hover:text-white font-bold text-xs"
            >
                ✕
            </button>
        </div>
    );
}