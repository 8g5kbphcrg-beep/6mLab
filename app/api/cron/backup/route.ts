import { NextRequest, NextResponse } from "next/server";
import { makeBackup } from "@/lib/backup";
import { mailReady, sendBackup } from "@/lib/email";
import { alert, why } from "@/lib/alert";

// Runs once a week (vercel.json): emails the backup of the site's data to 6M Lab (lib/backup.ts).
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });
  if (!mailReady()) return NextResponse.json({ skipped: "not configured" });
  try {
    const { date, file, summary } = await makeBackup();
    await sendBackup(date, file, summary);
    return NextResponse.json({ ok: true, date, bytes: file.length });
  } catch (e) {
    await alert("backup", "La sauvegarde hebdomadaire n'a pas pu partir", [why(e), "Télécharge-en une à la main depuis l'accueil de l'admin (Sauvegarde), puis vérifie Redis et l'email."]);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
