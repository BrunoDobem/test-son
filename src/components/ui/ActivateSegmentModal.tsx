"use client";

import { useState } from "react";
import {
  X,
  CloudUpload,
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  GitBranch,
  Zap,
  Users,
} from "lucide-react";
import {
  crmActions,
  exportPlatforms,
  simulateSegmentActivation,
} from "@/lib/export";
import type { SegmentRule } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface ActivateSegmentModalProps {
  open: boolean;
  onClose: () => void;
  segment: SegmentRule | null;
}

const canalIcon = {
  email: Mail,
  whatsapp: MessageCircle,
  jornada: GitBranch,
};

export function ActivateSegmentModal({ open, onClose, segment }: ActivateSegmentModalProps) {
  const [activating, setActivating] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; jobId: string } | null>(null);

  if (!open || !segment) return null;

  const handleActivate = async (targetId: string, type: "platform" | "crm") => {
    setActivating(`${type}-${targetId}`);
    setResult(null);
    const res = await simulateSegmentActivation(targetId, segment.nome, segment.fansEstimados, type);
    setActivating(null);
    if (res.success) setResult({ message: res.message, jobId: res.jobId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg animate-fade-in overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ativar segmento</h2>
            <p className="mt-0.5 text-xs text-gray-500">{segment.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">
            <Users className="h-5 w-5 text-brand-purple" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {formatNumber(segment.fansEstimados)} fãs qualificados
              </p>
              <p className="text-xs text-gray-500">v{segment.versao} · recalculado em schedule</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-blue" />
              <h3 className="text-sm font-semibold text-gray-900">Ações de CRM</h3>
            </div>
            <p className="mb-3 text-xs text-gray-500">
              Dispare jornadas e campanhas a partir deste segmento.
            </p>
            <div className="space-y-2">
              {crmActions.map((action) => {
                const Icon = canalIcon[action.canal];
                const key = `crm-${action.id}`;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleActivate(action.id, "crm")}
                    disabled={!!activating || !segment.ativo}
                    className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all duration-150 hover:border-brand-blue/30 hover:bg-blue-50/30 hover:shadow-sm disabled:opacity-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      {activating === key ? (
                        <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
                      ) : (
                        <Icon className="h-5 w-5 text-brand-blue" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{action.nome}</p>
                      <p className="text-xs text-gray-500">{action.descricao}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <CloudUpload className="h-4 w-4 text-brand-purple" />
              <h3 className="text-sm font-semibold text-gray-900">Enviar para plataforma</h3>
            </div>
            <p className="mb-3 text-xs text-gray-500">
              Sincronize o segmento com ferramentas externas de mídia e CRM.
            </p>
            <div className="space-y-2">
              {exportPlatforms.map((platform) => {
                const key = `platform-${platform.id}`;
                return (
                  <button
                    key={platform.id}
                    onClick={() => handleActivate(platform.id, "platform")}
                    disabled={!!activating || !segment.ativo}
                    className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all duration-150 hover:border-brand-purple/30 hover:bg-purple-50/30 hover:shadow-sm disabled:opacity-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                      {activating === key ? (
                        <Loader2 className="h-5 w-5 animate-spin text-brand-purple" />
                      ) : (
                        <CloudUpload className="h-5 w-5 text-brand-purple" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{platform.nome}</p>
                      <p className="text-xs text-gray-500">{platform.descricao}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {!segment.ativo && (
            <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
              Este segmento está inativo. Ative-o nas configurações para permitir disparos e exportações.
            </p>
          )}

          {result && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
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
