import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ title, subtitle, children, className, action }: CardProps) {
  return (
    <div
      className={cn(
        "card-surface overflow-hidden transition-shadow duration-150 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
