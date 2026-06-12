import type { Campaign, Fan } from "./types";
import type { DashboardFilters } from "./dashboard-filters";
import { filtersToLabel, getFilteredKpis } from "./dashboard-filters";

export type ExportFormat = "csv" | "xlsx";

export interface ExportPlatform {
  id: string;
  nome: string;
  descricao: string;
  tipo: "crm" | "ads" | "email" | "whatsapp";
}

export const exportPlatforms: ExportPlatform[] = [
  {
    id: "salesforce",
    nome: "Salesforce",
    descricao: "Sincronizar audiência como lista de contatos",
    tipo: "crm",
  },
  {
    id: "meta",
    nome: "Meta Custom Audiences",
    descricao: "Exportar para campanhas de retargeting e lookalike",
    tipo: "ads",
  },
  {
    id: "google",
    nome: "Google Ads Customer Match",
    descricao: "Audiências para campanhas de mídia paga",
    tipo: "ads",
  },
  {
    id: "rdstation",
    nome: "RD Station / E-mail Marketing",
    descricao: "Lista para disparos e automações de e-mail",
    tipo: "email",
  },
  {
    id: "whatsapp",
    nome: "WhatsApp Business (via n8n)",
    descricao: "Segmento para jornadas e mensagens ativas",
    tipo: "whatsapp",
  },
];

function escapeCsv(value: string | number | boolean | undefined): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFansToCsv(fans: Fan[], maskPii = true) {
  const headers = [
    "id",
    "nome",
    "email",
    "telefone",
    "cidade",
    "estado",
    "label",
    "artista",
    "genero",
    "status",
    "score",
    "origem",
    "campanhas",
    "ultimo_engajamento",
    "consentimento",
  ];

  const rows = fans.map((f) =>
    [
      f.id,
      f.nome,
      maskPii ? f.email.replace(/(.{2}).*(@.*)/, "$1***$2") : f.email,
      maskPii ? f.telefone.replace(/\d{4}$/, "****") : f.telefone,
      f.cidade,
      f.estado,
      f.label,
      f.artista,
      f.genero,
      f.status,
      f.score,
      f.origemPrimaria,
      f.campanhasParticipadas,
      f.ultimoEngajamento,
      f.consentimento ? "sim" : "nao",
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob(csv, `fan-data-platform-base-${date}.csv`, "text/csv;charset=utf-8");
}

export function exportCampaignsToCsv(campaigns: Campaign[]) {
  const headers = [
    "campanha",
    "tipo",
    "label",
    "artista",
    "genero",
    "plataforma",
    "mecanica",
    "segmento",
    "periodo",
    "leads",
    "leads_pagos",
    "leads_organicos",
    "investimento",
    "cpl",
    "taxa_conversao",
    "enviados",
    "aberturas",
    "cliques",
    "taxa_abertura",
    "taxa_clique",
  ];

  const rows = campaigns.map((c) =>
    [
      c.nome,
      c.tipo,
      c.label,
      c.artista,
      c.genero,
      c.plataforma,
      c.mecanica,
      c.segmento ?? "",
      c.periodo,
      c.leads,
      c.leadsPagos,
      c.leadsOrganicos,
      c.investimento,
      c.cpl,
      c.taxaConversao,
      c.enviados ?? "",
      c.aberturas ?? "",
      c.cliques ?? "",
      c.taxaAbertura ?? "",
      c.taxaClique ?? "",
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob(csv, `fan-data-platform-campanhas-${date}.csv`, "text/csv;charset=utf-8");
}

export function exportDashboardSummaryToCsv(filters: DashboardFilters) {
  const kpis = getFilteredKpis(filters);
  const filterLabel = filtersToLabel(filters);
  const rows = [
    ["relatorio", "Fan Data Platform - Resumo Dashboard"],
    ["gerado_em", new Date().toLocaleString("pt-BR")],
    ["filtros", filterLabel],
    ["", ""],
    ["metrica", "valor"],
    ["base_total", kpis.totalFans],
    ["novos_mes", kpis.novosMes],
    ["ltv", kpis.ltv],
    ["churn_rate", `${kpis.churnRate}%`],
    ["cpl_por_canal", kpis.cplMedio],
    ["taxa_conversao", `${kpis.taxaConversao}%`],
    ["engajamento_fa", `${kpis.engajamentoFans}%`],
    ["roi_campanha", `${kpis.roiCampanha}%`],
    ["taxa_match", `${kpis.matchRate}%`],
    ["campanhas_ativas", kpis.campanhasAtivas],
    ["deduplicados", kpis.deduplicados],
    ["taxa_ativos", `${kpis.taxaAtivos}%`],
  ];

  const csv = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob(csv, `fan-data-platform-dashboard-${date}.csv`, "text/csv;charset=utf-8");
}

export interface CrmAction {
  id: string;
  nome: string;
  descricao: string;
  canal: "email" | "whatsapp" | "jornada";
}

export const crmActions: CrmAction[] = [
  {
    id: "email-blast",
    nome: "Disparo de E-mail",
    descricao: "Campanha pontual para o segmento selecionado",
    canal: "email",
  },
  {
    id: "whatsapp-blast",
    nome: "Mensagem WhatsApp",
    descricao: "Envio ativo via WhatsApp Business (orquestrado via n8n)",
    canal: "whatsapp",
  },
  {
    id: "welcome-journey",
    nome: "Jornada de Boas-vindas",
    descricao: "Sequência automatizada pós-captação (e-mail + WhatsApp)",
    canal: "jornada",
  },
  {
    id: "reactivation-journey",
    nome: "Jornada de Reativação",
    descricao: "Fluxo multi-touch para fãs inativos",
    canal: "jornada",
  },
];

export function simulateSegmentActivation(
  targetId: string,
  segmentName: string,
  recordCount: number,
  type: "platform" | "crm"
): Promise<{ success: boolean; message: string; jobId: string }> {
  const platform = exportPlatforms.find((p) => p.id === targetId);
  const action = crmActions.find((a) => a.id === targetId);
  const targetLabel = type === "platform" ? platform?.nome : action?.nome;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Segmento "${segmentName}" (${recordCount.toLocaleString("pt-BR")} fãs) enviado para ${targetLabel ?? targetId}`,
        jobId: `ACT-${Date.now().toString(36).toUpperCase()}`,
      });
    }, 1800);
  });
}
