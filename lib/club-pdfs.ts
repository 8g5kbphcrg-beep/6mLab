import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// The club programs already exported as PDFs (scripts/clubs-pdf.mjs), for Admin > Clubs.
export type ClubPdfs = { dossier: string; titre: string; code: string | null; date: string; files: string[] };

export async function clubPdfs(): Promise<ClubPdfs[]> {
  const root = join(process.cwd(), "private", "clubs");
  const dirs = await readdir(root).catch(() => [] as string[]);
  const out: ClubPdfs[] = [];
  for (const dossier of dirs) {
    const files = (await readdir(join(root, dossier)).catch(() => [] as string[])).filter((f) => f.endsWith(".pdf")).sort();
    if (!files.length) continue;
    const info = JSON.parse(await readFile(join(root, dossier, "infos.json"), "utf8").catch(() => "{}"));
    out.push({ dossier, titre: info.titre ?? dossier, code: info.code ?? null, date: info.date ?? "", files });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}
