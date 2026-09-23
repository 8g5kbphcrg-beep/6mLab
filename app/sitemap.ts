import type { MetadataRoute } from "next";
import { locales, SITE } from "@/lib/dict";
import { posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = locales.map((l) => ({
    url: `${SITE}/${l}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE}/${x}`])) },
  }));
  const more = ["/fr/questionnaire", "/en/questionnaire", "/fr/conseils", ...posts.map((p) => `/fr/conseils/${p.slug}`)]
    .map((u) => ({ url: `${SITE}${u}`, lastModified: new Date() }));
  return [...home, ...more];
}
