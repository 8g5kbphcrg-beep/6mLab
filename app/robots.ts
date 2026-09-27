import type { MetadataRoute } from "next";
import { OPEN, SITE } from "@/lib/dict";

// Before the launch (lib/dict.ts OPEN), no search engine may read the site.
export default function robots(): MetadataRoute.Robots {
  if (!OPEN) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: `${SITE}/sitemap.xml` };
}
