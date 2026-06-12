"use client";

import { Activity, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ingestionSources, KPI_SUMMARY } from "@/lib/mock-data";
import { getLeadsHoje, getRegistrosHoje, getTaxaDedupVolume } from "@/lib/metrics";
import { formatNumber, formatPercent } from "@/lib/utils";

const statusConfig = {
  ativo: { icon: CheckCircle2, variant: "success" as const, label: "Ativo", color: "text-emerald-600" },
  atencao: { icon: AlertTriangle, variant: "warning" as const, label: "Atenção", color: "text-amber-600" },
  erro: { icon: XCircle, variant: "danger" as const, label: "Erro", color: "text-red-600" },
};

const metodoLabel = {
  webhook: "Event-driven (webhook)",
  batch: "Batch agendado",
  api: "API polling",
};

export default function IngestaoPage() {
  const totalHoje = getRegistrosHoje();
  const leadsHoje = getLeadsHoje();

  return (
    <AppShell>
      <Header
        title="Ingestão de Dados"
        subtitle="Pipeline event-driven + batch — idempotência e deduplicação ativas"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-surface border-l-4 border-l-emerald-500 p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Pipeline</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">Operacional</p>
          <p className="mt-1 text-xs text-gray-500">7/7 fontes conectadas</p>
        </div>
        <div className="card-surface border-l-4 border-l-brand-blue p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-blue" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Registros Hoje</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatNumber(totalHoje)}</p>
          <p className="mt-1 text-xs text-gray-500">
            Alinhado com Leads Hoje no dashboard ({formatNumber(leadsHoje)})
          </p>
        </div>
        <div className="card-surface border-l-4 border-l-brand-purple p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-purple" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Match Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatPercent(KPI_SUMMARY.matchRate)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {formatNumber(KPI_SUMMARY.deduplicados)} fundidos ({formatPercent(getTaxaDedupVolume())} do bruto)
          </p>
        </div>
      </div>

      <Card title="Fontes de Dados" subtitle="Ingestão → Raw/Staging → Unificação → Golden Record">
        <div className="space-y-3">
          {ingestionSources.map((src) => {
            const cfg = statusConfig[src.status];
            const Icon = cfg.icon;
            return (
              <div
                key={src.nome}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-50"
              >
                <Icon className={`h-5 w-5 shrink-0 ${cfg.color}`} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{src.nome}</span>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <Badge variant="neutral">{metodoLabel[src.metodo]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Última sync: {src.ultimaSync} · Latência: {src.latencia}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatNumber(src.registrosHoje)}</p>
                  <p className="text-xs text-gray-400">hoje</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { step: "1. Ingestão", desc: "Webhooks + batch + APIs com idempotência" },
          { step: "2. Unificação", desc: "Match por e-mail → telefone → nome+DOB" },
          { step: "3. Golden Record", desc: "ID interno estável + survivorship auditável" },
        ].map((item) => (
          <div key={item.step} className="card-surface p-5">
            <p className="text-sm font-semibold text-brand-blue">{item.step}</p>
            <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
