import type { ProgramSlug } from "@/lib/programs";

// The formula that fits the handball calendar right now (Paris time): Pré-saison from May to
// August, Maintien en saison from September to April. Pages that use it are rebuilt every hour.
export const recommended = (d = new Date()): ProgramSlug => {
  const month = Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "Europe/Paris" }).format(d));
  return month >= 5 && month <= 8 ? "pre-saison" : "maintien-saison";
};
