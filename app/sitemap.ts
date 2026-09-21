import type { MetadataRoute } from "next";
import { locales, SITE } from "@/lib/dict";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((l) => ({
    url: `${SITE}/${l}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE}/${x}`])) },
  }));
}
