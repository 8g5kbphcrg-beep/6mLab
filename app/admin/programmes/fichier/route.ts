import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { personal } from "@/lib/email";

// One program PDF, stamped with the customer's first name and order reference like the ones sent
// by email (lib/email.ts). Behind the admin password (proxy.ts).
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const f = q.get("f") ?? "", name = q.get("n") ?? "programme.pdf";
  if (!/^(en\/)?[a-z0-9-]+\.pdf$/.test(f) || !/^[a-z0-9-]+\.pdf$/.test(name)) return new NextResponse("Fichier invalide", { status: 400 });
  let pdf: Buffer;
  try { pdf = await readFile(join(process.cwd(), "programmes", f)); } catch { return new NextResponse("Ce fichier n'existe pas (encore)", { status: 404 }); }
  const firstName = (q.get("prenom") ?? "").slice(0, 40), ref = (q.get("ref") ?? "").slice(0, 20);
  const out = firstName || ref ? await personal(pdf, firstName, ref || "–", q.get("lang") === "en" ? "en" : "fr") : pdf;
  return new NextResponse(new Uint8Array(out), { headers: { "content-type": "application/pdf", "content-disposition": `inline; filename="${name}"`, "cache-control": "private, no-store" } });
}
