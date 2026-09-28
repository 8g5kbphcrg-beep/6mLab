import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

// The PDFs of a club program (scripts/clubs-pdf.mjs, private/clubs/<dossier>/), behind the admin
// password (middleware.ts): downloaded from Admin > Clubs, then sent to the coach.
export async function GET(_req: Request, { params }: { params: Promise<{ dossier: string; fichier: string }> }) {
  const { dossier, fichier } = await params;
  if (!/^[a-z0-9-]+$/.test(dossier) || !/^[1-4]-[a-z-]+\.pdf$/.test(fichier)) return new NextResponse("Fichier introuvable", { status: 404 });
  try {
    const pdf = await readFile(join(process.cwd(), "private", "clubs", dossier, fichier));
    return new NextResponse(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="6M-Lab-${dossier}-${fichier}"`, "cache-control": "private, no-store" } });
  } catch {
    return new NextResponse("Fichier introuvable", { status: 404 });
  }
}
