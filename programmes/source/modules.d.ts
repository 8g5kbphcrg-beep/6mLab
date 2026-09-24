// Types for the program sources imported by the website (exercise pages).
declare module "@/programmes/source/exercices.mjs" { export const exercices: Record<string, { name: string; how: string; cues?: string; easier?: string }>; }
declare module "@/programmes/source/figures.mjs" { export function animatedFigure(id: string, variant?: string): string | null; export function variants(id: string): string[]; }
declare module "@/lib/mark.mjs" {
  export const SLOGAN: string;
  export const MARK_VIEWBOX: string;
  export function markSvg(color?: string, ball?: string): string;
  export function markFile(color?: string, ball?: string): string;
  export function iconSvg(radius?: number): string;
}
