import { cn } from "@/lib/utils";

type ButtonVariant = "gradient" | "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  gradient:
    "bg-gradient-brand text-white shadow-sm hover:opacity-90 hover:shadow-md active:scale-[0.98]",
  primary:
    "bg-brand-black text-white hover:bg-gray-900 active:scale-[0.98]",
  secondary:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
