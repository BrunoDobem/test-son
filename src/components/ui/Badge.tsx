import { cn } from "@/lib/utils";

const variants = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  purple: "bg-purple-50 text-brand-purple border-purple-200",
  blue: "bg-blue-50 text-brand-blue border-blue-200",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
