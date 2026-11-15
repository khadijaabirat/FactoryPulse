export default function StatCard({
  title,
  value,
  color = "blue",
  icon,
  subtitle,
  badgeText,
}) {
  const themes = {
    blue: {
      accent: "bg-blue-600",
      badge: "bg-blue-50 text-blue-700 border-blue-200/60",
      iconBg: "bg-blue-50 text-blue-600",
    },
    green: {
      accent: "bg-emerald-600",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    red: {
      accent: "bg-rose-600",
      badge: "bg-rose-50 text-rose-700 border-rose-200/60",
      iconBg: "bg-rose-50 text-rose-600",
    },
    amber: {
      accent: "bg-amber-500",
      badge: "bg-amber-50 text-amber-700 border-amber-200/60",
      iconBg: "bg-amber-50 text-amber-600",
    },
  };

  const currentTheme = themes[color] || themes.blue;

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-md transition-all group overflow-hidden">
      {/* Sleek top colored accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${currentTheme.accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 tracking-tight">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value ?? 0}
          </p>
        </div>

        {icon && (
          <div
            className={`w-10 h-10 rounded-xl ${currentTheme.iconBg} flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-105`}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 font-medium truncate">
              {subtitle}
            </span>
          )}
          {badgeText && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${currentTheme.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
