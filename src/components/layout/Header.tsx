"use client";

import { Bell, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showExport?: boolean;
  onExport?: () => void;
}

export function Header({ title, subtitle, showExport, onExport }: HeaderProps) {
  return (
    <header className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="input-field w-56 py-2 pl-9 pr-4 text-sm"
          />
        </div>
        {showExport && (
          <Button variant="secondary" onClick={onExport}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        )}
        <button className="relative rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-all duration-150 hover:bg-gray-50 hover:text-gray-700">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-blue" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-sm">
          BC
        </div>
      </div>
    </header>
  );
}
