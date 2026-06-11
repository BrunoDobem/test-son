"use client";

import { useState } from "react";
import { X, FileSpreadsheet, CheckCircle2, Shield } from "lucide-react";
import {
  exportCampaignsToCsv,
  exportDashboardSummaryToCsv,
  exportFansToCsv,
} from "@/lib/export";
import type { Campaign, Fan } from "@/lib/types";
import type { DashboardFilters } from "@/lib/dashboard-filters";
import { filtersToLabel } from "@/lib/dashboard-filters";

export type ExportContext =
  | { type: "fans"; fans: Fan[]; maskPii?: boolean }
  | { type: "campaigns"; campaigns: Campaign[] }
  | { type: "dashboard"; filters: DashboardFilters; recordCount: number };

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  context: ExportContext;
}

export function ExportModal({ open, onClose, context }: ExportModalProps) {
  const [result, setResult] = useState<{ message: string; jobId: string } | null>(null);

  if (!open) return null;

  const recordCount =
    context.type === "fans"
      ? context.fans.length
      : context.type === "campaigns"
        ? context.campaigns.length
        : context.recordCount;

  const handleDownloadCsv = () => {
    if (context.type === "fans") {
      exportFansToCsv(context.fans, context.maskPii ?? true);
    } else if (context.type === "campaigns") {
      exportCampaignsToCsv(context.campaigns);
    } else {
      exportDashboardSummaryToCsv(context.filters);
    }
    setResult({
      message: "Arquivo CSV baixado com sucesso",
      jobId: `DL-${Date.now().toString(36).toUpperCase()}`,
    });
  };

  const filterInfo =
    context.type === "dashboard"
      ? filtersToLabel(context.filters)
      : context.type === "fans"
        ? `${recordCount} fãs na seleção atual`
        : `${recordCount} campanhas na seleção atual`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-fade-in rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Exportar dados</h2>
            <p className="mt-0.5 text-xs text-gray-500">{filterInfo}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Baixe a base filtrada em formato CSV. PII pode ser mascarada conforme política LGPD.
            </p>
            <button
              onClick={handleDownloadCsv}
              className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left transition-all duration-150 hover:border-brand-blue/30 hover:bg-blue-50/50 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Exportar CSV</p>
                <p className="text-xs text-gray-500">
                  {recordCount.toLocaleString("pt-BR")} registros · UTF-8
                </p>
              </div>
            </button>
            <div className="flex items-start gap-2 rounded-xl bg-blue-50/50 p-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <p className="text-xs text-gray-600">
                Exportações respeitam consentimento e status de opt-out. Apenas registros com base legal válida são incluídos.
              </p>
            </div>
          </div>

          {result && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">{result.message}</p>
                <p className="mt-1 text-xs text-gray-500">Job ID: {result.jobId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
