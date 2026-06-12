import {
  KPI_SUMMARY,
  ageDistribution,
  baseEvolution,
  campaigns,
  cplByChannel,
  cplByPlatform,
  dailyLeads,
  generoDistribution,
  geoDistribution,
  investmentEfficiency,
  labelDistribution,
  scoreDistribution,
  sourceDistribution,
  statusDistribution,
  topArtists,
  weeklyPerformance,
} from "./mock-data";
import type { Label } from "./types";
import { getPeriodDisplayLabel } from "./period-utils";

export type PeriodoPreset =
  | "today"
  | "yesterday"
  | "prev_week"
  | "7d"
  | "30d"
  | "prev_month"
  | "3m"
  | "12m"
  | "all"
  | "custom";

/** @deprecated use PeriodoPreset */
export type PeriodoFilter = PeriodoPreset;

export interface DashboardFilters {
  periodo: PeriodoPreset;
  periodoInicio?: string;
  periodoFim?: string;
  label: "" | Label;
  status: "" | "ativo" | "inativo" | "descadastrado";
  genero: string;
  plataforma: string;
}

export const defaultFilters: DashboardFilters = {
  periodo: "12m",
  label: "",
  status: "",
  genero: "",
  plataforma: "",
};

const LABEL_RATIO: Record<Label, number> = {
  "Sony Music": 1989420 / 2387420,
  "Som Livre": 398000 / 2387420,
};

const STATUS_RATIO = {
  ativo: 2104890 / 2387420,
  inativo: 245230 / 2387420,
  descadastrado: 37300 / 2387420,
};

const PERIODO_MONTHS: Record<PeriodoPreset, number> = {
  today: 1,
  yesterday: 1,
  prev_week: 1,
  "7d": 1,
  "30d": 2,
  prev_month: 2,
  "3m": 4,
  "12m": 8,
  all: 8,
  custom: 3,
};

const PERIODO_DAYS: Record<PeriodoPreset, number> = {
  today: 1,
  yesterday: 1,
  prev_week: 7,
  "7d": 7,
  "30d": 30,
  prev_month: 30,
  "3m": 90,
  "12m": 365,
  all: 7,
  custom: 30,
};

function resolvePeriodDays(filters: DashboardFilters): number {
  if (filters.periodo === "custom" && filters.periodoInicio && filters.periodoFim) {
    const start = new Date(filters.periodoInicio + "T12:00:00");
    const end = new Date(filters.periodoFim + "T12:00:00");
    const ms = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
  }
  return PERIODO_DAYS[filters.periodo];
}

function resolvePeriodMonths(filters: DashboardFilters): number {
  if (filters.periodo === "custom" && filters.periodoInicio && filters.periodoFim) {
    const days = resolvePeriodDays(filters);
    if (days <= 7) return 1;
    if (days <= 31) return 2;
    if (days <= 90) return 4;
    return 8;
  }
  return PERIODO_MONTHS[filters.periodo];
}

function periodoFactor(filters: DashboardFilters): number {
  const map: Record<PeriodoPreset, number> = {
    today: 0.01,
    yesterday: 0.01,
    prev_week: 0.03,
    "7d": 0.04,
    "30d": 0.12,
    prev_month: 0.1,
    "3m": 0.35,
    "12m": 1,
    all: 1,
    custom: Math.min(1, resolvePeriodDays(filters) / 365),
  };
  return map[filters.periodo] ?? 1;
}

function scale(n: number, ratio: number) {
  return Math.round(n * ratio);
}

function getBaseMultiplier(filters: DashboardFilters): number {
  let m = 1;
  if (filters.label) m *= LABEL_RATIO[filters.label];
  if (filters.status) m *= STATUS_RATIO[filters.status];
  if (filters.genero) {
    const g = generoDistribution.find((x) => x.genero === filters.genero);
    m *= g ? g.fans / generoDistribution.reduce((s, x) => s + x.fans, 0) : 0.15;
  }
  return m;
}

export function getFilteredKpis(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  const periodoFactorVal = periodoFactor(filters);

  const cplFactor =
    filters.plataforma === "TikTok" ? 1.08 : filters.plataforma === "Wyng" ? 0.82 : 1;

  const midiaCampaigns = campaigns.filter((c) => c.tipo === "midia" && c.investimento > 0);
  const avgConversao =
    midiaCampaigns.length > 0
      ? midiaCampaigns.reduce((s, c) => s + c.taxaConversao, 0) / midiaCampaigns.length
      : KPI_SUMMARY.taxaConversao;

  const engagedTotal = scoreDistribution
    .filter((s) => s.name === "Superfã" || s.name === "Engajado")
    .reduce((s, x) => s + x.value, 0);
  const baseTotal = scoreDistribution.reduce((s, x) => s + x.value, 0);
  const engajamentoBase = baseTotal > 0 ? (engagedTotal / baseTotal) * 100 : KPI_SUMMARY.engajamentoFans;

  return {
    totalFans: scale(KPI_SUMMARY.totalFans, m),
    novosMes: scale(KPI_SUMMARY.novosMes, m * periodoFactorVal),
    crescimentoMes: KPI_SUMMARY.crescimentoMes,
    cplMedio: KPI_SUMMARY.cplMedio * cplFactor,
    matchRate: KPI_SUMMARY.matchRate,
    campanhasAtivas: filters.label || filters.genero || filters.plataforma
      ? Math.max(4, Math.round(KPI_SUMMARY.campanhasAtivas * m))
      : KPI_SUMMARY.campanhasAtivas,
    deduplicados: scale(KPI_SUMMARY.deduplicados, m),
    taxaAtivos: filters.status === "ativo" ? 100 : filters.status === "inativo" ? 0 : KPI_SUMMARY.taxaAtivos,
    leadsHoje: scale(2820, m * (["7d", "today", "yesterday"].includes(filters.periodo) ? 1 : 0.85)),
    ltv: KPI_SUMMARY.ltv * (filters.label === "Som Livre" ? 0.92 : 1),
    churnRate:
      filters.status === "ativo"
        ? KPI_SUMMARY.churnRate * 0.6
        : filters.status === "inativo"
          ? KPI_SUMMARY.churnRate * 2.4
          : KPI_SUMMARY.churnRate,
    taxaConversao: avgConversao,
    engajamentoFans: engajamentoBase,
    roiCampanha: KPI_SUMMARY.roiCampanha * (filters.plataforma === "Wyng" ? 1.12 : 1),
  };
}

export function getFilteredEvolution(filters: DashboardFilters) {
  const months = resolvePeriodMonths(filters);
  const data = baseEvolution.slice(-months).map((point) => {
    if (filters.label === "Sony Music") {
      return { ...point, somLivre: 0, total: point.sony };
    }
    if (filters.label === "Som Livre") {
      return { ...point, sony: 0, total: point.somLivre };
    }
    if (filters.status) {
      const ratio = STATUS_RATIO[filters.status];
      return {
        mes: point.mes,
        sony: scale(point.sony, ratio),
        somLivre: scale(point.somLivre, ratio),
        total: scale(point.total, ratio),
      };
    }
    return point;
  });
  return data;
}

export function getFilteredLabelDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  if (filters.label) {
    return labelDistribution.filter((l) => l.name === filters.label);
  }
  return labelDistribution.map((l) => ({ ...l, value: scale(l.value, m / (filters.status ? STATUS_RATIO[filters.status] : 1)) }));
}

export function getFilteredStatusDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  if (filters.status) {
    const item = statusDistribution.find((s) => s.name.toLowerCase() === filters.status);
    return item ? [{ ...item, value: scale(item.value, m / STATUS_RATIO[filters.status]) }] : statusDistribution;
  }
  return statusDistribution.map((s) => ({
    ...s,
    value: scale(s.value, filters.label ? LABEL_RATIO[filters.label] : m),
  }));
}

export function getFilteredTopArtists(filters: DashboardFilters) {
  let list = [...topArtists];
  if (filters.label === "Som Livre") {
    list = list.filter((a) => ["Jorge & Mateus", "Gusttavo Lima"].includes(a.artista));
  } else if (filters.label === "Sony Music") {
    list = list.filter((a) => !["Jorge & Mateus", "Gusttavo Lima"].includes(a.artista));
  }
  if (filters.genero) {
    const genreMap: Record<string, string[]> = {
      Pop: ["Anitta"],
      Funk: ["Ludmilla"],
      Sertanejo: ["Jorge & Mateus", "Gusttavo Lima", "Zé Neto & Cristiano"],
      "R&B": [],
    };
    const allowed = genreMap[filters.genero];
    if (allowed) list = list.filter((a) => allowed.includes(a.artista));
  }
  const m = getBaseMultiplier(filters);
  return list.map((a) => ({ ...a, fans: scale(a.fans, m) }));
}

export function getFilteredDailyLeads(filters: DashboardFilters) {
  const days = resolvePeriodDays(filters);
  const m = getBaseMultiplier(filters);
  const paidBoost = filters.plataforma === "Meta" || filters.plataforma === "TikTok" ? 1.2 : 1;
  return dailyLeads.slice(-days).map((d) => ({
    ...d,
    pagos: scale(d.pagos, m * paidBoost),
    organicos: scale(d.organicos, m * (filters.plataforma ? 0.7 : 1)),
  }));
}

export function getFilteredCplByPlatform(filters: DashboardFilters) {
  let data = cplByPlatform.filter((p) => p.cpl > 0);
  if (filters.plataforma) {
    data = data.filter((p) => p.plataforma === filters.plataforma);
  }
  if (filters.label === "Som Livre") {
    return data.map((p) => ({ ...p, cpl: p.cpl * 0.95, leads: scale(p.leads, 0.35) }));
  }
  if (filters.label === "Sony Music") {
    return data.map((p) => ({ ...p, leads: scale(p.leads, 0.75) }));
  }
  return data;
}

const PLATAFORMA_TO_CANAL: Record<string, string> = {
  Meta: "Meta Lead Ads",
  TikTok: "TikTok Lead Ads",
  Wyng: "Wyng",
};

export function getFilteredCplByChannel(filters: DashboardFilters) {
  let data = [...cplByChannel];
  if (filters.plataforma) {
    const canal = PLATAFORMA_TO_CANAL[filters.plataforma];
    data = canal ? data.filter((c) => c.canal === canal) : [];
  }
  if (filters.label === "Som Livre") {
    return data.map((c) => ({ ...c, cpl: c.cpl * 0.95, leads: scale(c.leads, 0.35) }));
  }
  if (filters.label === "Sony Music") {
    return data.map((c) => ({ ...c, leads: scale(c.leads, 0.75) }));
  }
  return data;
}

export function getFilteredSourceDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  let data = sourceDistribution.map((s) => ({ ...s, leads: scale(s.leads, m) }));
  if (filters.plataforma) {
    const map: Record<string, string> = {
      Meta: "Meta Lead Ads",
      TikTok: "TikTok Lead Ads",
      Wyng: "Wyng",
    };
    const source = map[filters.plataforma];
    if (source) data = data.filter((s) => s.source === source);
  }
  return data;
}

export function getFilteredScoreDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  return scoreDistribution.map((s) => ({ ...s, value: scale(s.value, m) }));
}

export function getFilteredGeneroDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  let data = generoDistribution.map((g) => ({ ...g, fans: scale(g.fans, m) }));
  if (filters.genero) data = data.filter((g) => g.genero === filters.genero);
  return data;
}

export function getFilteredGeoDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  return geoDistribution.map((g) => ({ ...g, fans: scale(g.fans, m) }));
}

export function getFilteredAgeDistribution(filters: DashboardFilters) {
  const m = getBaseMultiplier(filters);
  return ageDistribution.map((a) => ({ ...a, fans: scale(a.fans, m) }));
}

export function getFilteredWeeklyPerformance(filters: DashboardFilters) {
  const weeks = Math.min(8, Math.max(4, Math.ceil(resolvePeriodDays(filters) / 7)));
  const m = getBaseMultiplier(filters);
  const paidBoost = filters.plataforma === "Meta" || filters.plataforma === "TikTok" ? 1.15 : 1;
  return weeklyPerformance.slice(-weeks).map((w) => ({
    ...w,
    leads: scale(w.leads, m),
    pagos: scale(w.pagos, m * paidBoost),
    organicos: scale(w.organicos, m * (filters.plataforma ? 0.75 : 1)),
    investimento: Math.round(w.investimento * m * paidBoost),
    cpl: w.cpl * (filters.plataforma === "TikTok" ? 1.06 : filters.plataforma === "Wyng" ? 0.9 : 1),
  }));
}

export function getFilteredInvestmentEfficiency(filters: DashboardFilters) {
  let data = investmentEfficiency.map((item) => ({ ...item }));
  if (filters.plataforma) {
    data = data.filter((item) => item.plataforma === filters.plataforma);
  }
  const m = getBaseMultiplier(filters);
  return data.map((item) => ({
    ...item,
    investimento: Math.round(item.investimento * m),
    leads: scale(item.leads, m),
    receitaEstimada: Math.round(item.receitaEstimada * m),
  }));
}

export function getFilteredCampaigns(filters: DashboardFilters) {
  return campaigns.filter((c) => {
    if (filters.label && c.label !== filters.label) return false;
    if (filters.genero && c.genero !== filters.genero) return false;
    if (filters.plataforma && c.plataforma !== filters.plataforma) return false;
    return true;
  });
}

export function countActiveFilters(filters: DashboardFilters): number {
  const periodActive = filters.periodo !== "12m" || Boolean(filters.periodoInicio);
  return (
    Object.entries(filters).filter(
      ([key, v]) => !["periodo", "periodoInicio", "periodoFim"].includes(key) && v !== ""
    ).length + (periodActive ? 1 : 0)
  );
}

export function filtersToLabel(filters: DashboardFilters): string {
  const parts: string[] = [];
  if (filters.periodo !== "12m" || filters.periodoInicio) {
    parts.push(getPeriodDisplayLabel(filters));
  }
  if (filters.label) parts.push(filters.label);
  if (filters.status) parts.push(`Status: ${filters.status}`);
  if (filters.genero) parts.push(filters.genero);
  if (filters.plataforma) parts.push(filters.plataforma);
  return parts.length ? parts.join(" · ") : "Sem filtros";
}
