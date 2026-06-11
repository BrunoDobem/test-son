import type { DashboardFilters, PeriodoPreset } from "./dashboard-filters";

export const PERIOD_PRESETS: { id: PeriodoPreset; label: string; group: 1 | 2 | 3 }[] = [
  { id: "today", label: "Hoje", group: 1 },
  { id: "yesterday", label: "Ontem", group: 1 },
  { id: "prev_week", label: "Semana anterior", group: 1 },
  { id: "7d", label: "Últimos 7 dias", group: 1 },
  { id: "30d", label: "Últimos 30 dias", group: 1 },
  { id: "prev_month", label: "Mês anterior", group: 2 },
  { id: "3m", label: "3 meses anteriores", group: 2 },
  { id: "12m", label: "12 meses anteriores", group: 2 },
  { id: "all", label: "Todo o histórico", group: 2 },
];

export function formatDatePt(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(start: Date, end: Date): number {
  const ms = Math.abs(end.getTime() - start.getTime());
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
}

export function getPeriodDisplayLabel(filters: DashboardFilters): string {
  if (filters.periodo === "custom" && filters.periodoInicio && filters.periodoFim) {
    const start = parseIsoDate(filters.periodoInicio);
    const end = parseIsoDate(filters.periodoFim);
    const sameYear = start.getFullYear() === end.getFullYear();
    if (sameYear && start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} ${formatDateShort(end)} ${end.getFullYear()}`;
    }
    return `${formatDateShort(start)} – ${formatDateShort(end)} ${end.getFullYear()}`;
  }
  const preset = PERIOD_PRESETS.find((p) => p.id === filters.periodo);
  return preset?.label ?? "Período";
}

export function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const next = cells.length - startDay - daysInMonth + 1;
    cells.push({ date: new Date(year, month + 1, next), inMonth: false });
  }

  return cells;
}

export const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

export function monthYearLabel(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = date.setHours(0, 0, 0, 0);
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);
  const min = Math.min(s, e);
  const max = Math.max(s, e);
  return t >= min && t <= max;
}
