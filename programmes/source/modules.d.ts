// Types for the program sources imported by the website (exercise pages).
declare module "@/programmes/source/exercices.mjs" { export const exercices: Record<string, { name: string; how: string; cues?: string; easier?: string }>; }
declare module "@/programmes/source/figures.mjs" {
  // sex: silhouette of the figure, f (woman), h (man) or n (not specified, the default).
  export function animatedFigure(id: string, variant?: string, opts?: { seconds?: number; steps?: number; sex?: "f" | "h" | "n" }): string | null;
  export function variants(id: string): string[];
}
declare module "@/lib/mark.mjs" {
  export const SLOGAN: string;
  export const MARK_VIEWBOX: string;
  export function markSvg(color?: string, ball?: string): string;
  export function markFile(color?: string, ball?: string): string;
  export function iconSvg(radius?: number): string;
}
declare module "@/programmes/source/lieux.mjs" {
  export const LIEUX: Record<"maison" | "salle", { name: string; short: string }>;
  export function exoFor<T extends object>(base: T, id: string, lieu: string): T & { name: string; how: string; cues?: string; easier?: string; band?: string; figs: [string, string, string][] | null };
}
