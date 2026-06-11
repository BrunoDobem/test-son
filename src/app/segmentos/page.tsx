"use client";

import { useState } from "react";
import { Plus, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ActivateSegmentModal } from "@/components/ui/ActivateSegmentModal";
import { segmentRules } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import type { SegmentRule } from "@/lib/types";

export default function SegmentosPage() {
  const [selectedSegment, setSelectedSegment] = useState<SegmentRule | null>(null);
  const [activateOpen, setActivateOpen] = useState(false);

  const openActivate = (seg: SegmentRule) => {
    setSelectedSegment(seg);
    setActivateOpen(true);
  };

  return (
    <AppShell>
      <Header
        title="Segmentação"
        subtitle="Definições versionadas — editável (única camada editável na aplicação)"
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Segmentos são computados por regra e recalculados em schedule. Use Ativar para disparar ações de CRM ou enviar a plataformas externas.
        </p>
        <Button variant="gradient" className="shrink-0">
          <Plus className="h-4 w-4" />
          Novo Segmento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {segmentRules.map((seg) => (
          <Card
            key={seg.id}
            title={seg.nome}
            subtitle={seg.descricao}
            action={
              <Badge variant={seg.ativo ? "success" : "neutral"}>
                {seg.ativo ? "Ativo" : "Inativo"}
              </Badge>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-2xl font-bold text-gray-900">{formatNumber(seg.fansEstimados)}</span>
                <span className="text-xs text-gray-500">fãs estimados</span>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Critérios</p>
                <div className="flex flex-wrap gap-2">
                  {seg.criterios.map((c) => (
                    <span
                      key={c}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500">
                  <span>v{seg.versao}</span>
                  <span className="mx-2">·</span>
                  <span>Atualizado em {seg.atualizadoEm}</span>
                </div>
                <Button
                  variant="gradient"
                  onClick={() => openActivate(seg)}
                  disabled={!seg.ativo}
                  className="px-3 py-1.5 text-xs"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Ativar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ActivateSegmentModal
        open={activateOpen}
        onClose={() => setActivateOpen(false)}
        segment={selectedSegment}
      />
    </AppShell>
  );
}
