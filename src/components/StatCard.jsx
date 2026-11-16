export default function StatCard({
  title,
  value,
  color = "yellow",
  icon,
  subtitle,
  badgeText,
}) {
  const themes = {
    yellow: {
      accent: "bg-amber-400",
      badge: "bg-amber-50 text-amber-900 border-amber-200",
      iconBg: "bg-amber-50 text-amber-800",
    },
    blue: {
      accent: "bg-zinc-900",
      badge: "bg-zinc-100 text-zinc-800 border-zinc-200",
      iconBg: "bg-zinc-100 text-zinc-800",
    },
    green: {
      accent: "bg-amber-400",
      badge: "bg-amber-50 text-amber-900 border-amber-200",
      iconBg: "bg-amber-50 text-amber-800",
    },
    red: {
      accent: "bg-zinc-400",
      badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
      iconBg: "bg-zinc-100 text-zinc-600",
    },
    slate: {
      accent: "bg-zinc-900",
      badge: "bg-zinc-100 text-zinc-800 border-zinc-200",
      iconBg: "bg-zinc-100 text-zinc-800",
    },
  };

  const currentTheme = themes[color] || themes.yellow;

  return (
    <div className="relative bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-[0_1px_3px_rgba(24,24,27,0.05)] hover:shadow-md transition-all group overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${currentTheme.accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-500 tracking-tight">
            {title}
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 tabular-nums">
            {value ?? 0}
          </p>
        </div>

        {icon && (
          <div
            className={`w-10 h-10 rounded-xl ${currentTheme.iconBg} flex items-center justify-center shrink-0 border border-zinc-200/60 transition-transform group-hover:scale-105`}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-zinc-500 font-medium truncate">
              {subtitle}
            </span>
          )}
          {badgeText && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentTheme.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
