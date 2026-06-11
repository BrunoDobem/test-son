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
import { Megaphone, Mail, Target } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { ExportModal } from "@/components/ui/ExportModal";
import { CHART, tooltipStyle } from "@/lib/chart-colors";
import { campaigns } from "@/lib/mock-data";
import { formatNumber, formatCurrency, formatPercent, cn } from "@/lib/utils";
import type { Campaign, CampaignType } from "@/lib/types";

const axisTick = { fill: CHART.axis, fontSize: 11 };

type FilterTipo = "todas" | CampaignType;

const filterTabs: { id: FilterTipo; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "midia", label: "Mídia" },
  { id: "crm", label: "CRM" },
];

export default function CampanhasPage() {
  const [exportOpen, setExportOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTipo>("todas");

  const filtered = useMemo(
    () => campaigns.filter((c) => filter === "todas" || c.tipo === filter),
    [filter]
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

  const showMidiaChart = filter !== "crm" && midiaChartData.length > 0;
  const showCrmChart = filter !== "midia" && crmChartData.length > 0;

  return (
    <AppShell>
      <Header
        title="Campanhas"
        subtitle="Mídia paga e orgânica + disparos e jornadas de CRM"
        showExport
        onExport={() => setExportOpen(true)}
      />

      {/* Filtro por tipo */}
      <div className="mb-6 flex gap-2">
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
            <span className="ml-2 text-xs opacity-70">
              ({tab.id === "todas" ? campaigns.length : campaigns.filter((c) => c.tipo === tab.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(filter === "todas" || filter === "midia") && (
          <KpiCard
            label="Leads Captados (Mídia)"
            value={formatNumber(totalLeads)}
            accent="blue"
            icon={<Megaphone className="h-4 w-4" />}
          />
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
          </>
        )}
        {filter === "midia" && (
          <KpiCard
            label="Campanhas de Mídia"
            value={String(midiaCampaigns.length)}
            accent="default"
          />
        )}
        {filter === "crm" && (
          <KpiCard
            label="Campanhas CRM"
            value={String(crmCampaigns.length)}
            accent="default"
          />
        )}
      </div>

      {/* Gráficos */}
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
