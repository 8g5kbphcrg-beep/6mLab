import type { MetadataRoute } from "next";
import { locales, SITE } from "@/lib/dict";
import { livePosts } from "@/lib/posts";
import { guides } from "@/lib/guides";
import { legalPaths } from "@/lib/legal";

// Rebuilt every hour at most, so scheduled articles are added on their date.
export const revalidate = 3600;

// Public pages only: no customer area, order, feedback or admin page.
export default function sitemap(): MetadataRoute.Sitemap {
  const home = locales.map((l) => ({
    url: `${SITE}/${l}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE}/${x}`])) },
  }));
  const progs = locales.flatMap((l) => ["", "/pre-saison", "/premiere-partie", "/deuxieme-partie", "/saison-complete"].map((s) => `/${l}/programmes${s}`));
  const more = [...locales.flatMap((l) => [`/${l}/handball`, `/${l}/forme/questionnaire`, `/${l}/contact`, `/${l}/faq`, `/${l}/clubs`, `/${l}/exercices/seance-gratuite`]), "/fr/a-propos", "/en/about", ...progs, "/fr/questionnaire", "/en/questionnaire", "/fr/conseils", ...livePosts().map((p) => `/fr/conseils/${p.slug}`), ...guides.map((g) => `/fr/guides/${g.slug}`), ...locales.flatMap((l) => Object.values(legalPaths[l]))]
    .map((u) => ({ url: `${SITE}${u}`, lastModified: new Date() }));
  return [...home, ...more];
}
