"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Megaphone, Mail, Target, Percent, DollarSign } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { ExportModal } from "@/components/ui/ExportModal";
import { CHART, tooltipStyle } from "@/lib/chart-colors";
import {
  aggregateByArtist,
  aggregateByLabel,
  aggregateByMechanic,
  aggregateByPlatform,
  getActiveCampaigns,
} from "@/lib/campaign-analytics";
import { campaigns, KPI_SUMMARY } from "@/lib/mock-data";
import { formatNumber, formatCurrency, formatPercent, cn } from "@/lib/utils";
import type { Campaign, CampaignType, Label } from "@/lib/types";

const axisTick = { fill: CHART.axis, fontSize: 11 };

type FilterTipo = "todas" | CampaignType;

const filterTabs: { id: FilterTipo; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "midia", label: "Mídia" },
  { id: "crm", label: "CRM" },
];

const labelOptions: ("" | Label)[] = ["", "Sony Music", "Som Livre"];
const platformOptions = ["", "Meta", "TikTok", "Wyng"];

export default function CampanhasPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTipo>("todas");
  const [labelFilter, setLabelFilter] = useState<"" | Label>("");
  const [artistFilter, setArtistFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const artists = useMemo(
    () => [...new Set(campaigns.map((c) => c.artista))].sort(),
    []
  );

  const filtered = useMemo(
    () =>
      campaigns.filter((c) => {
        if (filter !== "todas" && c.tipo !== filter) return false;
        if (labelFilter && c.label !== labelFilter) return false;
        if (artistFilter && c.artista !== artistFilter) return false;
        if (platformFilter && c.plataforma !== platformFilter) return false;
        return true;
      }),
    [filter, labelFilter, artistFilter, platformFilter]
  );

  const midiaCampaigns = filtered.filter((c) => c.tipo === "midia");
  const crmCampaigns = filtered.filter((c) => c.tipo === "crm");

  const midiaChartData = midiaCampaigns.map((c) => ({
    nome: c.artista,
    pagos: c.leadsPagos,
    organicos: c.leadsOrganicos,
  }));

  const crmChartData = crmCampaigns.map((c) => ({
    nome: c.artista,
    enviados: c.enviados ?? 0,
    aberturas: c.aberturas ?? 0,
    cliques: c.cliques ?? 0,
  }));

  const totalLeads = midiaCampaigns.reduce((s, c) => s + c.leads, 0);
  const totalEnviados = crmCampaigns.reduce((s, c) => s + (c.enviados ?? 0), 0);
  const avgOpenRate =
    crmCampaigns.length > 0
      ? crmCampaigns.reduce((s, c) => s + (c.taxaAbertura ?? 0), 0) / crmCampaigns.length
      : 0;

  const avgConversao =
    midiaCampaigns.length > 0
      ? midiaCampaigns.reduce((s, c) => s + c.taxaConversao, 0) / midiaCampaigns.length
      : KPI_SUMMARY.taxaConversao;

  const avgCpl =
    midiaCampaigns.filter((c) => c.cpl > 0).length > 0
      ? midiaCampaigns.filter((c) => c.cpl > 0).reduce((s, c) => s + c.cpl, 0) /
        midiaCampaigns.filter((c) => c.cpl > 0).length
      : KPI_SUMMARY.cplMedio;

  const platformPerf = useMemo(() => aggregateByPlatform(filtered), [filtered]);
  const mechanicPerf = useMemo(() => aggregateByMechanic(filtered), [filtered]);
  const labelBreakdown = useMemo(() => aggregateByLabel(filtered), [filtered]);
  const artistBreakdown = useMemo(() => aggregateByArtist(filtered), [filtered]);
  const activeCampaigns = useMemo(() => getActiveCampaigns(filtered), [filtered]);

  const showMidiaChart = filter !== "crm" && midiaChartData.length > 0;
  const showCrmChart = filter !== "midia" && crmChartData.length > 0;
  const showPlatformChart = filter !== "crm" && platformPerf.length > 0;
  const showMechanicChart = filter !== "crm" && mechanicPerf.length > 0;

  return (
    <AppShell>
      <Header
        title="Campanhas"
        subtitle="Mídia paga e orgânica + disparos e jornadas de CRM"
        showExport
        onExport={() => setExportOpen(true)}
      />

      <div className="mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Visão por Campanhas</h2>
        <p className="mt-1 text-xs text-gray-400">Performance por plataforma, mecânica, período, label e artista</p>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150",
              filter === tab.id
                ? "bg-brand-black text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">({filtered.length})</span>
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={labelFilter}
          onChange={(e) => setLabelFilter(e.target.value as "" | Label)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="">Todas as labels</option>
          {labelOptions.filter(Boolean).map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="">Todos os artistas</option>
          {artists.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="">Todas as plataformas</option>
          {platformOptions.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Períodos ativos */}
      {activeCampaigns.length > 0 && (
        <Card title="Monitoramento de Períodos Ativos" subtitle={`${activeCampaigns.length} campanhas em andamento`} className="mb-6">
          <div className="flex flex-wrap gap-3">
            {activeCampaigns.map((c) => (
              <div key={c.id} className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                <p className="font-mono text-xs text-brand-blue">{c.nome}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{c.artista} · {c.plataforma}</p>
                <p className="text-xs text-gray-500">{c.periodo}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(filter === "todas" || filter === "midia") && (
          <>
            <KpiCard
              label="Leads Captados (Mídia)"
              value={formatNumber(totalLeads)}
              accent="blue"
              icon={<Megaphone className="h-4 w-4" />}
            />
            <KpiCard
              label="CPL Médio"
              value={formatCurrency(avgCpl)}
              accent="cyan"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <KpiCard
              label="Taxa de Conversão"
              value={formatPercent(avgConversao)}
              accent="success"
              icon={<Percent className="h-4 w-4" />}
            />
            <KpiCard
              label="Campanhas de Mídia"
              value={String(midiaCampaigns.length)}
              accent="default"
            />
          </>
        )}
        {(filter === "todas" || filter === "crm") && (
          <>
            <KpiCard
              label="Disparos CRM"
              value={formatNumber(totalEnviados)}
              accent="purple"
              icon={<Mail className="h-4 w-4" />}
            />
            <KpiCard
              label="Taxa Abertura Média"
              value={formatPercent(avgOpenRate)}
              accent="cyan"
              icon={<Target className="h-4 w-4" />}
            />
            {filter === "crm" && (
              <KpiCard
                label="Campanhas CRM"
                value={String(crmCampaigns.length)}
                accent="default"
              />
            )}
          </>
        )}
      </div>

      {/* Gráficos — plataforma e mecânica */}
      {(showPlatformChart || showMechanicChart) && (
        <div className={cn("mb-6 grid gap-6", showPlatformChart && showMechanicChart ? "lg:grid-cols-2" : "grid-cols-1")}>
          {showPlatformChart && (
            <Card title="Performance por Plataforma" subtitle="Meta · TikTok · Wyng">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={platformPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="plataforma" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatNumber(Number(v ?? 0))} />
                  <Legend />
                  <Bar dataKey="leads" name="Leads" fill={CHART.blue} />
                  <Bar dataKey="leadsPagos" name="Leads Pagos" fill={CHART.purple} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
          {showMechanicChart && (
            <Card title="Análise por Tipo de Mecânica" subtitle="Leads e taxa de conversão média">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mechanicPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="mecanica" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, name) => [
                      name === "taxaConversao" ? formatPercent(Number(v ?? 0)) : formatNumber(Number(v ?? 0)),
                      name === "taxaConversao" ? "Conv. média" : "Leads",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="leads" name="Leads" fill={CHART.cyan} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap gap-2">
                {mechanicPerf.map((m) => (
                  <span key={m.mecanica} className="rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {m.mecanica}: {formatPercent(m.taxaConversao)} conv.
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Leitura por label e artista */}
      {filter !== "crm" && (labelBreakdown.length > 0 || artistBreakdown.length > 0) && (
        <div className={cn("mb-6 grid gap-6", labelBreakdown.length > 0 && artistBreakdown.length > 0 ? "lg:grid-cols-2" : "grid-cols-1")}>
          {labelBreakdown.length > 0 && (
            <Card title="Leitura por Label" subtitle="Leads captados por selo">
              <div className="space-y-3">
                {labelBreakdown.map((l) => (
                  <div key={l.label} className="flex items-center justify-between">
                    <Badge variant={l.label === "Sony Music" ? "blue" : "purple"}>{l.label}</Badge>
                    <span className="text-sm font-semibold text-gray-900">{formatNumber(l.leads)} leads · {l.campanhas} camp.</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {artistBreakdown.length > 0 && (
            <Card title="Leitura por Artista" subtitle="Performance de captação por artista">
              <div className="space-y-3">
                {artistBreakdown.map((a) => (
                  <div key={a.artista}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{a.artista}</span>
                      <span className="text-gray-500">{formatNumber(a.leads)} · {a.campanhas} camp.</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-purple"
                        style={{ width: `${(a.leads / artistBreakdown[0].leads) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Gráficos — leads e CRM */}
      <div className={cn("mb-6 grid gap-6", showMidiaChart && showCrmChart ? "lg:grid-cols-2" : "grid-cols-1")}>
        {showMidiaChart && (
          <Card title="Leads por Campanha de Mídia" subtitle="Pagos vs orgânicos">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={midiaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="nome" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="pagos" name="Pagos" fill={CHART.blue} stackId="a" />
                <Bar dataKey="organicos" name="Orgânicos" fill={CHART.cyan} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {showCrmChart && (
          <Card title="Engajamento CRM" subtitle="Enviados · aberturas · cliques">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={crmChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="nome" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="enviados" name="Enviados" fill={CHART.purple} />
                <Bar dataKey="aberturas" name="Aberturas" fill={CHART.blue} />
                <Bar dataKey="cliques" name="Cliques" fill={CHART.cyan} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Tabela unificada */}
      <Card title="Detalhamento" subtitle="Nomenclatura padronizada SL_* · mídia e CRM">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-3 pr-4 font-semibold">Campanha</th>
                <th className="pb-3 pr-4 font-semibold">Tipo</th>
                <th className="pb-3 pr-4 font-semibold">Label</th>
                <th className="pb-3 pr-4 font-semibold">Artista</th>
                <th className="pb-3 pr-4 font-semibold">Canal</th>
                <th className="pb-3 pr-4 font-semibold">Mecânica</th>
                <th className="pb-3 pr-4 font-semibold">Período</th>
                {(filter === "todas" || filter === "crm") && (
                  <th className="pb-3 pr-4 font-semibold">Segmento</th>
                )}
                {(filter === "todas" || filter === "midia") && (
                  <>
                    <th className="pb-3 pr-4 text-right font-semibold">Leads</th>
                    <th className="pb-3 pr-4 text-right font-semibold">Investimento</th>
                    <th className="pb-3 pr-4 text-right font-semibold">CPL</th>
                  </>
                )}
                {(filter === "todas" || filter === "crm") && (
                  <>
                    <th className="pb-3 pr-4 text-right font-semibold">Enviados</th>
                    <th className="pb-3 pr-4 text-right font-semibold">Abertura</th>
                    <th className="pb-3 text-right font-semibold">Clique</th>
                  </>
                )}
                {filter === "midia" && (
                  <th className="pb-3 text-right font-semibold">Conv.</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <CampaignRow key={c.id} campaign={c} filter={filter} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        context={{ type: "campaigns", campaigns: filtered }}
      />
    </AppShell>
  );
}

function CampaignRow({ campaign: c, filter }: { campaign: Campaign; filter: FilterTipo }) {
  return (
    <tr className="border-b border-gray-50 transition hover:bg-gray-50">
      <td className="py-3 pr-4 font-mono text-xs text-brand-blue">{c.nome}</td>
      <td className="py-3 pr-4">
        <Badge variant={c.tipo === "midia" ? "blue" : "purple"}>
          {c.tipo === "midia" ? "Mídia" : "CRM"}
        </Badge>
      </td>
      <td className="py-3 pr-4">
        <Badge variant={c.label === "Sony Music" ? "blue" : "purple"}>{c.label}</Badge>
      </td>
      <td className="py-3 pr-4 font-medium text-gray-900">{c.artista}</td>
      <td className="py-3 pr-4 text-gray-600">{c.plataforma}</td>
      <td className="py-3 pr-4 text-gray-600">{c.mecanica}</td>
      <td className="py-3 pr-4 text-xs text-gray-500">{c.periodo}</td>

      {(filter === "todas" || filter === "crm") && (
        <td className="py-3 pr-4 text-xs text-gray-500">
          {c.tipo === "crm" ? c.segmento : "—"}
        </td>
      )}

      {(filter === "todas" || filter === "midia") && (
        <>
          <td className="py-3 pr-4 text-right font-semibold text-gray-900">
            {c.tipo === "midia" ? formatNumber(c.leads) : "—"}
          </td>
          <td className="py-3 pr-4 text-right text-gray-600">
            {c.tipo === "midia" && c.investimento > 0 ? formatCurrency(c.investimento) : "—"}
          </td>
          <td className="py-3 pr-4 text-right">
            {c.tipo === "midia" ? (
              c.cpl > 0 ? (
                <span className="font-semibold text-gray-900">{formatCurrency(c.cpl)}</span>
              ) : (
                <Badge variant="success">Orgânico</Badge>
              )
            ) : (
              "—"
            )}
          </td>
        </>
      )}

      {(filter === "todas" || filter === "crm") && (
        <>
          <td className="py-3 pr-4 text-right font-semibold text-gray-900">
            {c.tipo === "crm" ? formatNumber(c.enviados ?? 0) : "—"}
          </td>
          <td className="py-3 pr-4 text-right text-emerald-600">
            {c.tipo === "crm" ? formatPercent(c.taxaAbertura ?? 0) : "—"}
          </td>
          <td className="py-3 text-right font-semibold text-brand-blue">
            {c.tipo === "crm" ? formatPercent(c.taxaClique ?? 0) : "—"}
          </td>
        </>
      )}

      {filter === "midia" && (
        <td className="py-3 text-right font-semibold text-emerald-600">{c.taxaConversao}%</td>
      )}
    </tr>
  );
}
