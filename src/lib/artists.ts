import type { Label } from "./types";

export interface ArtistCatalogEntry {
  nome: string;
  label: Label;
  genero: string;
}

/** Catálogo oficial de artistas — fonte única para labels e gêneros */
export const ARTISTS: ArtistCatalogEntry[] = [
  { nome: "Jorge e Matheus", label: "Som Livre", genero: "Sertanejo" },
  { nome: "Ret", label: "Som Livre", genero: "Pop" },
  { nome: "Gusttavo Lima", label: "Sony Music", genero: "Sertanejo" },
  { nome: "Turma do Pagode", label: "Sony Music", genero: "Pagode" },
  { nome: "Luísa Sonza", label: "Sony Music", genero: "Pop" },
];

export const SOM_LIVRE_ARTISTS = ARTISTS.filter((a) => a.label === "Som Livre").map((a) => a.nome);
export const SONY_ARTISTS = ARTISTS.filter((a) => a.label === "Sony Music").map((a) => a.nome);

export function getArtistsByLabel(label: Label): ArtistCatalogEntry[] {
  return ARTISTS.filter((a) => a.label === label);
}

export function getArtistGenero(artista: string): string | undefined {
  return ARTISTS.find((a) => a.nome === artista)?.genero;
}

export function getArtistsByGenero(genero: string): string[] {
  return ARTISTS.filter((a) => a.genero === genero).map((a) => a.nome);
}
