"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Zap, GitMerge, Percent, LineChart as LineChartIcon, DollarSign, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DashboardFiltersBar } from "@/components/ui/DashboardFilters";
import { ExportModal } from "@/components/ui/ExportModal";
import {
  defaultFilters,
  getFilteredCplByChannel,
  getFilteredCplByPlatform,
  getFilteredDailyLeads,
  getFilteredGeneroDistribution,
  getFilteredInvestmentEfficiency,
  getFilteredKpis,
  getFilteredScoreDistribution,
  getFilteredSourceDistribution,
  getFilteredWeeklyPerformance,
} from "@/lib/dashboard-filters";
import { CHART, tooltipStyle } from "@/lib/chart-colors";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/utils";

const axisTick = { fill: CHART.axis, fontSize: 11 };

export default function DashboardOperacionalPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [exportOpen, setExportOpen] = useState(false);

  const kpis = useMemo(() => getFilteredKpis(filters), [filters]);
  const daily = useMemo(() => getFilteredDailyLeads(filters), [filters]);
  const cplData = useMemo(() => getFilteredCplByChannel(filters), [filters]);
  const sources = useMemo(() => getFilteredSourceDistribution(filters), [filters]);
  const scores = useMemo(() => getFilteredScoreDistribution(filters), [filters]);
  const generos = useMemo(() => getFilteredGeneroDistribution(filters), [filters]);
  const platformData = useMemo(() => getFilteredCplByPlatform(filters), [filters]);
  const weekly = useMemo(() => getFilteredWeeklyPerformance(filters), [filters]);
  const efficiency = useMemo(() => getFilteredInvestmentEfficiency(filters), [filters]);
  const maxGenero = generos[0]?.fans ?? 1;

  return (
    <AppShell>
      <Header
        title="Dashboard Operacional"
        subtitle="Performance de campanhas, CPL, conversão e engajamento"
        showExport
        onExport={() => setExportOpen(true)}
      />

      <DashboardFiltersBar filters={filters} onChange={setFilters} variant="operacional" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Campanhas Ativas" value={String(kpis.campanhasAtivas)} accent="blue" icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Leads Hoje" value={formatNumber(kpis.leadsHoje)} change={6.8} changeLabel="vs ontem" accent="purple" icon={<Zap className="h-4 w-4" />} />
        <KpiCard label="Deduplicados" value={formatNumber(kpis.deduplicados)} changeLabel="registros fundidos" accent="cyan" icon={<GitMerge className="h-4 w-4" />} />
        <KpiCard label="Taxa Ativos" value={`${kpis.taxaAtivos}%`} change={0.3} changeLabel="vs mês anterior" accent="success" icon={<RefreshCw className="h-4 w-4" />} />
      </div>

      <div className="mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Atribuição de Mídia</h2>
        <p className="mt-1 text-xs text-gray-400">CPL, comparativo pago/orgânico e eficiência de investimento</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="CPL por Canal" value={formatCurrency(kpis.cplMedio)} change={-2.1} changeLabel="médio ponderado" accent="cyan" icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Taxa de Conversão" value={formatPercent(kpis.taxaConversao)} change={1.4} changeLabel="vs mês anterior" accent="success" icon={<Percent className="h-4 w-4" />} />
        <KpiCard label="ROI de Campanha" value={formatPercent(kpis.roiCampanha)} change={12.6} changeLabel="mídia paga" accent="purple" icon={<LineChartIcon className="h-4 w-4" />} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Comparativo Pago vs. Orgânico" subtitle="Leads diários — período filtrado">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="data" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="pagos" name="Pagos" stroke={CHART.blue} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="organicos" name="Orgânicos" stroke={CHART.cyan} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="CPL por Canal" subtitle="Custo por lead por canal de captação — campanhas pagas">
          {cplData.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">Nenhum canal para os filtros selecionados.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cplData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="canal" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value ?? 0)), "CPL"]} />
                <Bar dataKey="cpl" fill={CHART.purple} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Performance por Plataforma" subtitle="Meta · TikTok · Wyng — leads e CPL">
          {platformData.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">Nenhuma plataforma para os filtros selecionados.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="plataforma" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis yAxisId="leads" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <YAxis yAxisId="cpl" orientation="right" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    name === "cpl" ? formatCurrency(Number(value ?? 0)) : formatNumber(Number(value ?? 0)),
                    name === "cpl" ? "CPL" : "Leads",
                  ]}
                />
                <Legend />
                <Bar yAxisId="leads" dataKey="leads" name="Leads" fill={CHART.blue} />
                <Bar yAxisId="cpl" dataKey="cpl" name="CPL" fill={CHART.purple} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Evolução Semanal de Performance" subtitle="Leads, CPL e ROI — últimas semanas">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="semana" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis yAxisId="leads" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
              <YAxis yAxisId="cpl" orientation="right" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar yAxisId="leads" dataKey="pagos" name="Pagos" stackId="leads" fill={CHART.blue} />
              <Bar yAxisId="leads" dataKey="organicos" name="Orgânicos" stackId="leads" fill={CHART.cyan} />
              <Line yAxisId="cpl" type="monotone" dataKey="cpl" name="CPL" stroke={CHART.purple} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mb-6">
        <Card title="Eficiência de Investimento" subtitle="Investimento vs. receita estimada e ROI por plataforma">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th className="pb-3 pr-4 font-semibold">Plataforma</th>
                  <th className="pb-3 pr-4 text-right font-semibold">Investimento</th>
                  <th className="pb-3 pr-4 text-right font-semibold">Leads</th>
                  <th className="pb-3 pr-4 text-right font-semibold">Receita Est.</th>
                  <th className="pb-3 text-right font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {efficiency.map((row) => (
                  <tr key={row.plataforma} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{row.plataforma}</td>
                    <td className="py-3 pr-4 text-right text-gray-600">{formatCurrency(row.investimento)}</td>
                    <td className="py-3 pr-4 text-right font-semibold text-gray-900">{formatNumber(row.leads)}</td>
                    <td className="py-3 pr-4 text-right text-emerald-600">{formatCurrency(row.receitaEstimada)}</td>
                    <td className="py-3 text-right font-semibold text-brand-purple">{formatPercent(row.roi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Segmentação Operacional</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Fontes de Ingestão" subtitle="Volume por canal de captação">
          <div className="space-y-3">
            {sources.map((src) => (
              <div key={src.source} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{src.source}</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(src.leads)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Scoring de Fãs" subtitle="Distribuição por nível de engajamento">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scores}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatNumber(Number(v ?? 0))} />
              <Bar dataKey="value">
                {scores.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Por Gênero Musical" subtitle="Segmentação essencial">
          <div className="space-y-3">
            {generos.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum gênero para os filtros selecionados.</p>
            ) : (
              generos.map((g) => (
                <div key={g.genero}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{g.genero}</span>
                    <span className="font-semibold text-gray-900">{formatNumber(g.fans)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-purple"
                      style={{ width: `${(g.fans / maxGenero) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="blue">Pipeline ativo</Badge>
          <span className="text-sm text-gray-600">
            Última sincronização completa: há 15 min · {formatNumber(kpis.deduplicados)} registros deduplicados no ciclo
          </span>
        </div>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        context={{ type: "dashboard", filters, recordCount: kpis.totalFans }}
      />
    </AppShell>
  );
}
