// Types for the program sources imported by the website (exercise pages).
declare module "@/programmes/source/exercices.mjs" { export const exercices: Record<string, { name: string; how: string; cues?: string; easier?: string }>; }
declare module "@/programmes/source/figures.mjs" { export function animatedFigure(id: string, variant?: string): string | null; export function variants(id: string): string[]; }
