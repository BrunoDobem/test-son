import { dailyLeads, ingestionSources, KPI_SUMMARY } from "./mock-data";

/** Último dia do gráfico diário — fonte única para "Leads Hoje" */
export function getLeadsHoje(): number {
  const last = dailyLeads[dailyLeads.length - 1];
  return last.pagos + last.organicos;
}

export function getLeadsHojeBreakdown(): { pagos: number; organicos: number } {
  const last = dailyLeads[dailyLeads.length - 1];
  return { pagos: last.pagos, organicos: last.organicos };
}

/** Soma de registros ingeridos hoje — deve bater com getLeadsHoje() */
export function getRegistrosHoje(): number {
  return ingestionSources.reduce((s, src) => s + src.registrosHoje, 0);
}

/** Registros brutos históricos antes da deduplicação */
export function getRegistrosBrutos(): number {
  return KPI_SUMMARY.totalFans + KPI_SUMMARY.deduplicados;
}

/** Taxa de registros fundidos sobre o volume bruto ingerido (%) */
export function getTaxaDedupVolume(): number {
  const brutos = getRegistrosBrutos();
  return brutos > 0 ? Math.round((KPI_SUMMARY.deduplicados / brutos) * 1000) / 10 : 0;
}

/** Estimativa de duplicatas fundidas hoje com base no match rate */
export function getDeduplicadosHoje(leadsHoje: number): number {
  const missRate = (100 - KPI_SUMMARY.matchRate) / 100;
  return Math.round(leadsHoje * missRate);
}
