/**
 * Composant réutilisable StatCard : Affiche un indicateur KPI avec un titre,
 * une valeur, un sous-titre optionnel, une couleur de bordure et une icône.
 */
export default function StatCard({
  title,
  value,
  color = "blue",
  icon,
  subtitle,
}) {
  // Styles selon la couleur passée en prop
  const stylesCouleurs = {
    blue: {
      border: "border-blue-500",
      bgLight: "bg-blue-50",
      text: "text-blue-600",
    },
    green: {
      border: "border-emerald-500",
      bgLight: "bg-emerald-50",
      text: "text-emerald-600",
    },
    red: {
      border: "border-rose-500",
      bgLight: "bg-rose-50",
      text: "text-rose-600",
    },
    yellow: {
      border: "border-amber-500",
      bgLight: "bg-amber-50",
      text: "text-amber-600",
    },
  };

  const current = stylesCouleurs[color] || stylesCouleurs.blue;

  return (
    <div
      className={`bg-white rounded-2xl p-6 border-l-4 ${current.border} border border-slate-200/80 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
          {value ?? 0}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      {icon && (
        <div
          className={`w-12 h-12 rounded-xl ${current.bgLight} ${current.text} flex items-center justify-center shrink-0 shadow-inner`}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
