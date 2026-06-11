"use client";

import { useState } from "react";
import { Save, Sliders } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { scoreDistribution, scoringRules } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function ScoringPage() {
  const [rules, setRules] = useState(scoringRules);
  const totalPeso = rules.filter((r) => r.ativo).reduce((s, r) => s + r.peso, 0);

  return (
    <AppShell>
      <Header
        title="Scoring de Fãs"
        subtitle="Regras configuráveis — Superfã → Inativo (Fase 2)"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {scoreDistribution.map((s) => (
          <div key={s.name} className="card-surface p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="text-xs font-medium text-gray-500">{s.name}</span>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900">{formatNumber(s.value)}</p>
          </div>
        ))}
      </div>

      <Card
        title="Regras de Pontuação"
        subtitle={`Peso total ativo: ${totalPeso}% — recalculado diariamente às 03:00`}
        action={
          <Button variant="primary" className="px-3 py-1.5 text-xs">
            <Save className="h-3.5 w-3.5" />
            Salvar alterações
          </Button>
        }
      >
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-50"
            >
              <Sliders className="h-4 w-4 shrink-0 text-gray-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{rule.nome}</span>
                  <Badge variant={rule.ativo ? "success" : "neutral"}>
                    {rule.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500">{rule.condicao}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={rule.peso}
                  onChange={(e) =>
                    setRules((prev) =>
                      prev.map((r) =>
                        r.id === rule.id ? { ...r, peso: Number(e.target.value) } : r
                      )
                    )
                  }
                  className="w-24 accent-brand-blue"
                />
                <span className="w-10 text-right text-sm font-bold text-brand-blue">{rule.peso}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs text-gray-600">
          Auditoria: Toda alteração de regra é versionada e registrada (quem, quando, o quê). Classificações são computadas — nunca editadas manualmente por fã.
        </p>
      </div>
    </AppShell>
  );
}
