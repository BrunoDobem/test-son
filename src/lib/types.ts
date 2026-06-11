export type Label = "Sony Music" | "Som Livre";
export type FanStatus = "ativo" | "inativo" | "descadastrado";
export type FanScore = "superfa" | "engajado" | "casual" | "inativo";
export type DataSource =
  | "Sony Music Fans"
  | "Filtr Bot"
  | "Wyng"
  | "Meta Lead Ads"
  | "TikTok Lead Ads"
  | "Salesforce"
  | "Página Externa";

export interface Fan {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  dataNascimento: string;
  label: Label;
  artista: string;
  genero: string;
  status: FanStatus;
  score: FanScore;
  origemPrimaria: DataSource;
  salesforceId?: string;
  campanhasParticipadas: number;
  ultimoEngajamento: string;
  consentimento: boolean;
}

export type CampaignType = "midia" | "crm";
export type CrmCanal = "E-mail" | "WhatsApp" | "Jornada";

export interface Campaign {
  id: string;
  nome: string;
  tipo: CampaignType;
  label: Label;
  artista: string;
  genero: string;
  plataforma: string;
  mecanica: string;
  periodo: string;
  segmento?: string;
  /** Mídia: total de leads captados */
  leads: number;
  leadsPagos: number;
  leadsOrganicos: number;
  investimento: number;
  cpl: number;
  taxaConversao: number;
  /** CRM: métricas de disparo */
  enviados?: number;
  aberturas?: number;
  cliques?: number;
  taxaAbertura?: number;
  taxaClique?: number;
}

export interface SegmentRule {
  id: string;
  nome: string;
  descricao: string;
  criterios: string[];
  fansEstimados: number;
  versao: number;
  atualizadoEm: string;
  ativo: boolean;
}

export interface ScoringRule {
  id: string;
  nome: string;
  peso: number;
  condicao: string;
  ativo: boolean;
}

export interface IngestionSource {
  nome: DataSource;
  metodo: "webhook" | "batch" | "api";
  status: "ativo" | "atencao" | "erro";
  ultimaSync: string;
  registrosHoje: number;
  latencia: string;
}

export interface TimeSeriesPoint {
  mes: string;
  sony: number;
  somLivre: number;
  total: number;
}

export interface DailyLeadPoint {
  data: string;
  pagos: number;
  organicos: number;
}
