import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  accent?: "blue" | "purple" | "cyan" | "success" | "default";
  icon?: React.ReactNode;
}

const accentMap = {
  blue: "border-l-brand-blue",
  purple: "border-l-brand-purple",
  cyan: "border-l-brand-cyan",
  success: "border-l-emerald-500",
  default: "border-l-gray-200",
};

const iconColorMap = {
  blue: "text-brand-blue",
  purple: "text-brand-purple",
  cyan: "text-brand-cyan",
  success: "text-emerald-600",
  default: "text-gray-400",
};

export function KpiCard({
  label,
  value,
  change,
  changeLabel,
  accent = "default",
  icon,
}: KpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "card-surface border-l-4 p-6 transition-all duration-150 hover:shadow-md",
        accentMap[accent]
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
        {icon && <div className={iconColorMap[accent]}>{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span
            className={cn("text-xs font-medium", isPositive ? "text-emerald-600" : "text-red-500")}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
