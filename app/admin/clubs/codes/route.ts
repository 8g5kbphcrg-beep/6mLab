import { NextRequest, NextResponse } from "next/server";
import { createClubCode, deleteClubCode, freeClubDevices } from "@/lib/club-access";

// Admin (behind the password in proxy.ts): create a club access code, free its devices, or
// delete it (lib/club-access.ts). Back to the Clubs page, on the codes.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const action = String(form.get("action") ?? ""), code = String(form.get("code") ?? "");
  const back = (q = "") => NextResponse.redirect(`${req.nextUrl.origin}/admin/clubs${q}#codes`, 303);
  try {
    if (action === "create") {
      const club = String(form.get("club") ?? "").trim().slice(0, 80), team = String(form.get("team") ?? "").trim().slice(0, 60);
      const end = Date.parse(`${String(form.get("end") ?? "")}T23:59:59+02:00`), max = Math.min(80, Math.max(1, Number(form.get("max")) || 30));
      if (!club || !Number.isFinite(end) || end < Date.now()) return back("?code=erreur");
      const c = await createClubCode(club, team, end, max);
      return back(`?code=${c.code}`);
    }
    if (/^CLUB-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      if (action === "free") await freeClubDevices(code);
      if (action === "delete") await deleteClubCode(code);
    }
    return back();
  } catch (e) {
    console.error("[club codes]", e);
    return back("?code=erreur");
  }
}
