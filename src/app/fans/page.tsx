"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ExportModal } from "@/components/ui/ExportModal";
import { fans } from "@/lib/mock-data";
import { maskEmail, maskPhone } from "@/lib/utils";
import type { Fan, FanScore, FanStatus, Label } from "@/lib/types";

const scoreLabels: Record<FanScore, string> = {
  superfa: "Superfã",
  engajado: "Engajado",
  casual: "Casual",
  inativo: "Inativo",
};

const scoreVariant: Record<FanScore, "blue" | "purple" | "cyan" | "neutral"> = {
  superfa: "blue",
  engajado: "purple",
  casual: "cyan",
  inativo: "neutral",
};

const statusVariant: Record<FanStatus, "success" | "neutral" | "danger"> = {
  ativo: "success",
  inativo: "neutral",
  descadastrado: "danger",
};

export default function FansPage() {
  const [showPii, setShowPii] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterLabel, setFilterLabel] = useState<Label | "">("");
  const [filterStatus, setFilterStatus] = useState<FanStatus | "">("");

  const filtered = fans.filter((f) => {
    if (filterLabel && f.label !== filterLabel) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    return true;
  });

  return (
    <AppShell>
      <Header
        title="Base de Fãs"
        subtitle="Golden record unificado — somente leitura (dados ingeridos)"
        showExport
        onExport={() => setExportOpen(true)}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <Lock className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-xs text-gray-600">Base read-only — edição apenas em configurações</span>
        </div>
        <Button variant="secondary" onClick={() => setShowPii(!showPii)} className="px-3 py-2 text-xs">
          {showPii ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showPii ? "Ocultar PII" : "Revelar PII"}
        </Button>
        <select
          value={filterLabel}
          onChange={(e) => setFilterLabel(e.target.value as Label | "")}
          className="input-field px-3 py-2 text-xs"
        >
          <option value="">Todas as labels</option>
          <option value="Sony Music">Sony Music</option>
          <option value="Som Livre">Som Livre</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FanStatus | "")}
          className="input-field px-3 py-2 text-xs"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="descadastrado">Descadastrado</option>
        </select>
      </div>

      <Card title={`${filtered.length} fãs exibidos`} subtitle="Amostra representativa da base unificada (2,38M registros)">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-3 pr-4 font-semibold">ID</th>
                <th className="pb-3 pr-4 font-semibold">Nome</th>
                <th className="pb-3 pr-4 font-semibold">Contato</th>
                <th className="pb-3 pr-4 font-semibold">Local</th>
                <th className="pb-3 pr-4 font-semibold">Label</th>
                <th className="pb-3 pr-4 font-semibold">Artista</th>
                <th className="pb-3 pr-4 font-semibold">Score</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Origem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fan: Fan) => (
                <tr key={fan.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-400">{fan.id}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{fan.nome}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600">
                    <div>{showPii ? fan.email : maskEmail(fan.email)}</div>
                    <div className="text-gray-400">{showPii ? fan.telefone : maskPhone(fan.telefone)}</div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-600">
                    {fan.cidade}, {fan.estado}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={fan.label === "Sony Music" ? "blue" : "purple"}>
                      {fan.label}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{fan.artista}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={scoreVariant[fan.score]}>{scoreLabels[fan.score]}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant[fan.status]}>{fan.status}</Badge>
                  </td>
                  <td className="py-3 text-xs text-gray-500">{fan.origemPrimaria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        context={{ type: "fans", fans: filtered, maskPii: !showPii }}
      />
    </AppShell>
  );
}
