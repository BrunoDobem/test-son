"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Filter,
  Sliders,
  Bot,
  Database,
  BarChart3,
  Music2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { href: "/dashboard/executivo", label: "Dashboard Executivo", icon: LayoutDashboard },
  { href: "/dashboard/operacional", label: "Dashboard Operacional", icon: BarChart3 },
  { href: "/fans", label: "Base de Fãs", icon: Users },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/segmentos", label: "Segmentação", icon: Filter },
  { href: "/scoring", label: "Scoring", icon: Sliders },
  { href: "/ingestao", label: "Ingestão de Dados", icon: Database },
  { href: "/assistente", label: "Assistente IA", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-brand-black transition-all duration-200 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/[0.06]",
          collapsed ? "justify-center px-0" : "gap-3 px-5"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
          <Music2 className="h-4 w-4 text-brand-black" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">
              Fan Data Platform
            </p>
            <p className="truncate text-[10px] text-gray-500">Sony Music · Som Livre</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Menu
          </p>
        )}
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group flex items-center text-sm transition-colors duration-150",
                    collapsed
                      ? "justify-center rounded-lg px-0 py-2.5"
                      : "gap-3 rounded-lg px-3 py-2.5",
                    active
                      ? cn(
                          "bg-white/[0.06] text-white",
                          !collapsed && "border-l-2 border-brand-cyan pl-[10px]"
                        )
                      : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
                  )}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center",
                      collapsed ? "h-9 w-9" : "h-4 w-4",
                      active && "relative"
                    )}
                  >
                    {active && collapsed && (
                      <span className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.06]" />
                    )}
                    <Icon
                      className={cn(
                        "relative z-10 h-[18px] w-[18px]",
                        active ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                      )}
                    />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] p-2">
        {!collapsed && (
          <div className="mb-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Fase 1
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-gray-600">
              MVP · dados mockados
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center rounded-lg text-gray-500 transition-colors duration-150 hover:bg-white/[0.04] hover:text-gray-300",
            collapsed ? "justify-center py-2.5" : "gap-2 px-3 py-2.5"
          )}
          title={collapsed ? "Expandir menu" : "Recuar menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
              <span className="text-xs font-medium">Recuar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
