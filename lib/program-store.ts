import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { get } from "@vercel/blob";
import manifest from "@/lib/pdf-manifest.json";

// The program PDFs: in the Vercel Blob store on the site (copied at each build by
// scripts/blob-sync.mjs, listed in lib/pdf-manifest.json), in the programmes/ folder on a
// computer. rel: the path inside programmes/ ("guide-pre-saison-salle.pdf", "en/…").
const files = manifest.files as Record<string, string>;
const local = (rel: string) => readFile(join(process.cwd(), "programmes", rel));

export async function readProgram(rel: string): Promise<Buffer | null> {
  const pathname = files[rel];
  if (!pathname || !process.env.BLOB_READ_WRITE_TOKEN) return local(rel).catch(() => null);
  for (const access of manifest.access ? [manifest.access as "private" | "public"] : (["private", "public"] as const)) {
    try {
      const r = await get(pathname, { access });
      if (r?.statusCode === 200) return Buffer.from(await new Response(r.stream).arrayBuffer());
    } catch {}
  }
  return null;
}
// Whether a PDF exists, without downloading it (admin pages).
export const programExists = async (rel: string) => (files[rel] && process.env.BLOB_READ_WRITE_TOKEN ? true : (await local(rel).then(() => true, () => false)));
