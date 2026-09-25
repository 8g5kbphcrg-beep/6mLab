import { animatedFigure, variants } from "@/programmes/source/figures.mjs";
import type { Post } from "@/lib/posts";

// An exercise animation (bodyweight version when there is one).
export function Anim({ id, className }: { id: string; className?: string }) {
  const v = variants(id)[0];
  return v ? <div className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: animatedFigure(id, v) ?? "" }} /> : null;
}

// Card titles drop the "Étude :" prefix, already shown by the badge.
export const cardTitle = (p: Post) => (p.source ? p.title.replace(/^Étude\s*:\s*/, "").replace(/^./, (c) => c.toUpperCase()) : p.title);
