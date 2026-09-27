import type { MetadataRoute } from "next";
import { locales, SITE } from "@/lib/dict";
import { posts } from "@/lib/posts";
import { legalPaths } from "@/lib/legal";

// Public pages only: no customer area, order, feedback or admin page.
export default function sitemap(): MetadataRoute.Sitemap {
  const home = locales.map((l) => ({
    url: `${SITE}/${l}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE}/${x}`])) },
  }));
  const progs = locales.flatMap((l) => ["", "/pre-saison", "/maintien-saison", "/saison-complete"].map((s) => `/${l}/programmes${s}`));
  const more = [...locales.flatMap((l) => [`/${l}/handball`, `/${l}/forme/questionnaire`, `/${l}/contact`, `/${l}/clubs`, `/${l}/exercices/seance-gratuite`]), "/fr/a-propos", "/en/about", ...progs, "/fr/questionnaire", "/en/questionnaire", "/fr/conseils", ...posts.map((p) => `/fr/conseils/${p.slug}`), ...locales.flatMap((l) => Object.values(legalPaths[l]))]
    .map((u) => ({ url: `${SITE}${u}`, lastModified: new Date() }));
  return [...home, ...more];
}
