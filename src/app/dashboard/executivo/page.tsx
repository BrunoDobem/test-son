"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, TrendingUp, DollarSign, Target } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { DashboardFiltersBar } from "@/components/ui/DashboardFilters";
import { ExportModal } from "@/components/ui/ExportModal";
import {
  defaultFilters,
  getFilteredEvolution,
  getFilteredKpis,
  getFilteredLabelDistribution,
  getFilteredStatusDistribution,
  getFilteredTopArtists,
} from "@/lib/dashboard-filters";
import { CHART, tooltipStyle } from "@/lib/chart-colors";
import { formatNumber, formatCurrency } from "@/lib/utils";

const axisTick = { fill: CHART.axis, fontSize: 11 };

export default function DashboardExecutivoPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [exportOpen, setExportOpen] = useState(false);

  const kpis = useMemo(() => getFilteredKpis(filters), [filters]);
  const evolution = useMemo(() => getFilteredEvolution(filters), [filters]);
  const labelDist = useMemo(() => getFilteredLabelDistribution(filters), [filters]);
  const statusDist = useMemo(() => getFilteredStatusDistribution(filters), [filters]);
  const artists = useMemo(() => getFilteredTopArtists(filters), [filters]);

  return (
    <AppShell>
      <Header
        title="Dashboard Executivo"
        subtitle="Visão consolidada da base de fãs Brasil — golden record unificado"
        showExport
        onExport={() => setExportOpen(true)}
      />

      <DashboardFiltersBar filters={filters} onChange={setFilters} variant="executivo" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Base Total Brasil"
          value={formatNumber(kpis.totalFans)}
          change={kpis.crescimentoMes}
          changeLabel="vs mês anterior"
          accent="blue"
          icon={<Users className="h-4 w-4" />}
        />
        <KpiCard
          label="Novos Fãs (Mês)"
          value={formatNumber(kpis.novosMes)}
          change={3.4}
          changeLabel="vs mês anterior"
          accent="purple"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          label="CPL Médio"
          value={formatCurrency(kpis.cplMedio)}
          change={-2.1}
          changeLabel="vs trimestre"
          accent="cyan"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiCard
          label="Taxa de Match"
          value={`${kpis.matchRate}%`}
          change={0.8}
          changeLabel="deduplicação"
          accent="success"
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          title="Evolução da Base"
          subtitle="Crescimento histórico por label"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={evolution}>
              <defs>
                <linearGradient id="sonyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART.blue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="slGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART.purple} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="mes" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatNumber(Number(value ?? 0)), ""]} />
              <Legend />
              {(!filters.label || filters.label === "Sony Music") && (
                <Area type="monotone" dataKey="sony" name="Sony Music" stroke={CHART.blue} fill="url(#sonyGrad)" strokeWidth={2} />
              )}
              {(!filters.label || filters.label === "Som Livre") && (
                <Area type="monotone" dataKey="somLivre" name="Som Livre" stroke={CHART.purple} fill="url(#slGrad)" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Distribuição por Label" subtitle="Participação na base unificada">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={labelDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {labelDist.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatNumber(Number(value ?? 0))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Status da Base" subtitle="Ativos, inativos e descadastrados (LGPD)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
              <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatNumber(Number(value ?? 0))} />
              <Bar dataKey="value">
                {statusDist.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Artistas" subtitle="Maiores bases de fãs unificados">
          <div className="space-y-4">
            {artists.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum artista para os filtros selecionados.</p>
            ) : (
              artists.map((artist, i) => (
                <div key={artist.artista} className="flex items-center gap-4">
                  <span className="w-5 text-xs font-bold text-gray-400">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{artist.artista}</span>
                      <span className="text-xs text-gray-500">{formatNumber(artist.fans)}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-brand"
                        style={{ width: `${(artist.fans / artists[0].fans) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">+{artist.crescimento}%</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        context={{ type: "dashboard", filters, recordCount: kpis.totalFans }}
      />
    </AppShell>
  );
}
