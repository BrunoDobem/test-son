"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardFilters, PeriodoPreset } from "@/lib/dashboard-filters";
import {
  PERIOD_PRESETS,
  WEEKDAYS,
  daysBetween,
  formatDateShort,
  getMonthGrid,
  getPeriodDisplayLabel,
  isInRange,
  isSameDay,
  monthYearLabel,
  toIsoDate,
} from "@/lib/period-utils";

interface PeriodSelectorProps {
  filters: DashboardFilters;
  onChange: (patch: Partial<DashboardFilters>) => void;
}

export function PeriodSelector({ filters, onChange }: PeriodSelectorProps) {
  const [open, setOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(5);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCalendarMode(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (filters.periodo === "custom" && filters.periodoInicio && filters.periodoFim) {
      const start = new Date(filters.periodoInicio + "T12:00:00");
      const end = new Date(filters.periodoFim + "T12:00:00");
      setRangeStart(start);
      setRangeEnd(end);
      setViewYear(end.getFullYear());
      setViewMonth(end.getMonth());
    }
  }, [filters.periodo, filters.periodoInicio, filters.periodoFim]);

  const selectPreset = (id: PeriodoPreset) => {
    onChange({ periodo: id, periodoInicio: undefined, periodoFim: undefined });
    setOpen(false);
    setCalendarMode(false);
  };

  const openCalendar = () => {
    setCalendarMode(true);
    if (!rangeStart) {
      const today = new Date(2026, 5, 10);
      setRangeStart(new Date(2026, 5, 1));
      setRangeEnd(today);
    }
  };

  const handleDayClick = (date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (date < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
  };

  const applyCustomRange = () => {
    if (!rangeStart || !rangeEnd) return;
    onChange({
      periodo: "custom",
      periodoInicio: toIsoDate(rangeStart),
      periodoFim: toIsoDate(rangeEnd),
    });
    setOpen(false);
    setCalendarMode(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const grid = getMonthGrid(viewYear, viewMonth);
  const groups = [1, 2, 3] as const;

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
        Período
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-w-[200px] items-center gap-2 rounded-xl border bg-white px-3 py-2 text-left text-sm transition-all duration-150",
          open
            ? "border-brand-blue shadow-[0_0_0_3px_rgba(0,87,255,0.12)]"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
        <span className="flex-1 truncate font-medium text-gray-900">
          {getPeriodDisplayLabel(filters)}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg animate-fade-in">
          {!calendarMode ? (
            <div className="py-1">
              {groups.map((group, gi) => (
                <div key={group}>
                  {gi > 0 && <div className="my-1 border-t border-gray-100" />}
                  {PERIOD_PRESETS.filter((p) => p.group === group).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => selectPreset(preset.id)}
                      className={cn(
                        "flex w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50",
                        filters.periodo === preset.id && "bg-blue-50/80 font-medium text-brand-blue"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              ))}
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={openCalendar}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                Datas específicas…
              </button>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Escolha o intervalo</p>
                <button
                  type="button"
                  onClick={() => setCalendarMode(false)}
                  className="text-xs font-medium text-brand-blue hover:underline"
                >
                  Voltar
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium capitalize text-gray-900">
                  {monthYearLabel(viewYear, viewMonth)}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-0.5">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="py-1 text-center text-[10px] font-medium uppercase text-gray-400">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {grid.map(({ date, inMonth }, i) => {
                  const selected =
                    (rangeStart && isSameDay(date, rangeStart)) ||
                    (rangeEnd && isSameDay(date, rangeEnd));
                  const inRange =
                    rangeStart &&
                    rangeEnd &&
                    isInRange(date, rangeStart, rangeEnd) &&
                    !selected;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => inMonth && handleDayClick(date)}
                      disabled={!inMonth}
                      className={cn(
                        "flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors",
                        !inMonth && "cursor-default text-gray-300",
                        inMonth && !selected && !inRange && "text-gray-700 hover:bg-gray-100",
                        inRange && "bg-blue-50 text-gray-900",
                        selected && "bg-brand-black font-semibold text-white"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {rangeStart && rangeEnd && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  {formatDateShort(rangeStart)} – {formatDateShort(rangeEnd)}
                  <span className="ml-1 text-gray-400">
                    ({daysBetween(rangeStart, rangeEnd)} dias)
                  </span>
                </p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMode(false);
                    setOpen(false);
                  }}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={applyCustomRange}
                  disabled={!rangeStart || !rangeEnd}
                  className="rounded-xl bg-brand-black px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-900 disabled:opacity-40"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
