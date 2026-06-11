"use client";

import { Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  defaultFilters,
  countActiveFilters,
  type DashboardFilters,
} from "@/lib/dashboard-filters";
import type { Label } from "@/lib/types";
import { PeriodSelector } from "@/components/ui/PeriodSelector";

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  variant: "executivo" | "operacional";
}

const selectClass = "input-field px-3 py-2 text-xs";

export function DashboardFiltersBar({ filters, onChange, variant }: DashboardFiltersProps) {
  const activeCount = countActiveFilters(filters);

  const update = (patch: Partial<DashboardFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="card-surface mb-6 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand-blue" />
          <span className="text-sm font-semibold text-gray-900">Filtros</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">
              {activeCount} ativo{activeCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => onChange(defaultFilters)}
          className={cn(
            "flex items-center gap-1.5 text-xs text-gray-500 transition hover:text-gray-900",
            activeCount === 0 && "pointer-events-none opacity-40"
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpar filtros
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <PeriodSelector filters={filters} onChange={update} />

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            Label
          </label>
          <select
            value={filters.label}
            onChange={(e) => update({ label: e.target.value as Label | "" })}
            className={selectClass}
          >
            <option value="">Todas</option>
            <option value="Sony Music">Sony Music</option>
            <option value="Som Livre">Som Livre</option>
          </select>
        </div>

        {variant === "executivo" && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                update({ status: e.target.value as DashboardFilters["status"] })
              }
              className={selectClass}
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="descadastrado">Descadastrado</option>
            </select>
          </div>
        )}

        {variant === "operacional" && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Gênero
              </label>
              <select
                value={filters.genero}
                onChange={(e) => update({ genero: e.target.value })}
                className={selectClass}
              >
                <option value="">Todos</option>
                <option value="Pop">Pop</option>
                <option value="Funk">Funk</option>
                <option value="Sertanejo">Sertanejo</option>
                <option value="R&B">R&B</option>
                <option value="Rock">Rock</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Plataforma
              </label>
              <select
                value={filters.plataforma}
                onChange={(e) => update({ plataforma: e.target.value })}
                className={selectClass}
              >
                <option value="">Todas</option>
                <option value="Meta">Meta</option>
                <option value="TikTok">TikTok</option>
                <option value="Wyng">Wyng</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
