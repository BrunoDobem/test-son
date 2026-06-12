import type { Campaign, Label } from "./types";

export interface PlatformPerformance {
  plataforma: string;
  leads: number;
  leadsPagos: number;
  investimento: number;
  cpl: number;
}

export interface MechanicPerformance {
  mecanica: string;
  leads: number;
  campanhas: number;
  taxaConversao: number;
}

export interface LabelArtistBreakdown {
  label: string;
  artista: string;
  leads: number;
}

export function aggregateByPlatform(campaigns: Campaign[]): PlatformPerformance[] {
  const midia = campaigns.filter((c) => c.tipo === "midia");
  const map = new Map<string, { leads: number; leadsPagos: number; investimento: number }>();

  for (const c of midia) {
    const cur = map.get(c.plataforma) ?? { leads: 0, leadsPagos: 0, investimento: 0 };
    map.set(c.plataforma, {
      leads: cur.leads + c.leads,
      leadsPagos: cur.leadsPagos + c.leadsPagos,
      investimento: cur.investimento + c.investimento,
    });
  }

  return Array.from(map.entries())
    .map(([plataforma, v]) => ({
      plataforma,
      leads: v.leads,
      leadsPagos: v.leadsPagos,
      investimento: v.investimento,
      cpl: v.leadsPagos > 0 ? v.investimento / v.leadsPagos : 0,
    }))
    .sort((a, b) => b.leads - a.leads);
}

export function aggregateByMechanic(campaigns: Campaign[]): MechanicPerformance[] {
  const midia = campaigns.filter((c) => c.tipo === "midia");
  const map = new Map<string, { leads: number; campanhas: number; conversaoSum: number }>();

  for (const c of midia) {
    const cur = map.get(c.mecanica) ?? { leads: 0, campanhas: 0, conversaoSum: 0 };
    map.set(c.mecanica, {
      leads: cur.leads + c.leads,
      campanhas: cur.campanhas + 1,
      conversaoSum: cur.conversaoSum + c.taxaConversao,
    });
  }

  return Array.from(map.entries())
    .map(([mecanica, v]) => ({
      mecanica,
      leads: v.leads,
      campanhas: v.campanhas,
      taxaConversao: v.campanhas > 0 ? v.conversaoSum / v.campanhas : 0,
    }))
    .sort((a, b) => b.leads - a.leads);
}

export function getActiveCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.filter((c) => c.periodo.includes("Jun/26") || c.periodo.includes("Mai–Jun/26") || c.periodo.includes("Abr–Jun/26"));
}

export function aggregateByLabel(campaigns: Campaign[]): { label: Label; leads: number; campanhas: number }[] {
  const midia = campaigns.filter((c) => c.tipo === "midia");
  const map = new Map<Label, { leads: number; campanhas: number }>();

  for (const c of midia) {
    const cur = map.get(c.label) ?? { leads: 0, campanhas: 0 };
    map.set(c.label, { leads: cur.leads + c.leads, campanhas: cur.campanhas + 1 });
  }

  return Array.from(map.entries()).map(([label, v]) => ({ label, ...v }));
}

export function aggregateByArtist(campaigns: Campaign[]): { artista: string; leads: number; campanhas: number }[] {
  const midia = campaigns.filter((c) => c.tipo === "midia");
  const map = new Map<string, { leads: number; campanhas: number }>();

  for (const c of midia) {
    const cur = map.get(c.artista) ?? { leads: 0, campanhas: 0 };
    map.set(c.artista, { leads: cur.leads + c.leads, campanhas: cur.campanhas + 1 });
  }

  return Array.from(map.entries())
    .map(([artista, v]) => ({ artista, ...v }))
    .sort((a, b) => b.leads - a.leads);
}
