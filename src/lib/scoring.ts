import type { ScoringRule } from "./types";

const SCORE_COLORS = ["#0057FF", "#7A3FFF", "#00D9FF", "#9CA3AF"] as const;
const SCORE_NAMES = ["Superfã", "Engajado", "Casual", "Inativo"] as const;

/** Distribuição base com pesos padrão (30+25+20+15+10) — alinhada ao total de fãs */
const BASE_SHARES = [0.1309, 0.3737, 0.3767, 0.1187] as const;

const ENGAGEMENT_RULE_IDS = new Set(["r1", "r2", "r3", "r4"]);
const DEFAULT_ENGAGEMENT_WEIGHT = 90;
const DEFAULT_RECENCY_WEIGHT = 10;

export interface ScoreDistributionPoint {
  name: (typeof SCORE_NAMES)[number];
  value: number;
  color: string;
}

export function computeScoreDistribution(
  rules: ScoringRule[],
  totalFans: number
): ScoreDistributionPoint[] {
  const active = rules.filter((r) => r.ativo);
  const engagementWeight = active
    .filter((r) => ENGAGEMENT_RULE_IDS.has(r.id))
    .reduce((s, r) => s + r.peso, 0);
  const recencyWeight = active.find((r) => r.id === "r5")?.peso ?? 0;

  const engagementFactor = engagementWeight / DEFAULT_ENGAGEMENT_WEIGHT;
  const recencyFactor = recencyWeight / DEFAULT_RECENCY_WEIGHT;

  let shares: number[] = [...BASE_SHARES];

  const engDelta = (engagementFactor - 1) * 0.14;
  shares[0] += engDelta * 0.3;
  shares[1] += engDelta * 0.7;
  shares[2] -= engDelta * 0.65;
  shares[3] -= engDelta * 0.35;

  const recDelta = (recencyFactor - 1) * 0.1;
  shares[3] -= recDelta;
  shares[2] -= recDelta * 0.35;
  shares[1] += recDelta * 0.55;
  shares[0] += recDelta * 0.45;

  shares = shares.map((s) => Math.max(0.02, s));
  const sum = shares.reduce((a, b) => a + b, 0);
  shares = shares.map((s) => s / sum);

  const values = shares.map((s) => Math.round(totalFans * s));
  const diff = totalFans - values.reduce((a, b) => a + b, 0);
  values[0] += diff;

  return SCORE_NAMES.map((name, i) => ({
    name,
    value: values[i],
    color: SCORE_COLORS[i],
  }));
}

export function computeEngajamentoPercent(distribution: ScoreDistributionPoint[]): number {
  const engaged = distribution
    .filter((d) => d.name === "Superfã" || d.name === "Engajado")
    .reduce((s, d) => s + d.value, 0);
  const total = distribution.reduce((s, d) => s + d.value, 0);
  return total > 0 ? Math.round((engaged / total) * 1000) / 10 : 0;
}
