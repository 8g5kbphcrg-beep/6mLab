import type { ProgramSlug } from "@/lib/programs";
import { currentSlot } from "@/lib/season-parts";

// The part of the season under way (lib/season-parts.ts), or the Pré-saison during the June break.
// Pages that use it are rebuilt every hour.
export const recommended = (d = new Date()): ProgramSlug => currentSlot(d.getTime())?.part ?? "pre-saison";
