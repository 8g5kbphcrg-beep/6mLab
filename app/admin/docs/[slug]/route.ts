import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { DOCS } from "@/lib/admin-docs";
import { SITE } from "@/lib/dict";

// 6M Lab's working documents (private/docs/), behind the admin password (proxy.ts). Each file
// is a page body: it gets its document head here, and a link back to the admin.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) return new NextResponse("Document introuvable", { status: 404 });
  // __SITE__: the address of the site, for the links of the documents (the eye of the club PDFs).
  const body = (await readFile(join(process.cwd(), "private", "docs", `${slug}.html`), "utf8")).replaceAll("__SITE__", SITE);
  const back = `<a href="/admin${doc.section === "site" ? "" : `/${doc.section}`}" style="position:fixed;z-index:50;left:12px;bottom:12px;font:600 14px system-ui,sans-serif;background:#16123F;color:#fff;border-radius:999px;padding:8px 14px;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,.2)">← Espace 6M Lab</a>`;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><style>[hidden]{display:none!important}</style></head><body style="margin:0">${body}${back}</body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store" } });
}
