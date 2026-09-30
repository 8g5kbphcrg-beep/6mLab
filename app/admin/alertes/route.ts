import { NextRequest, NextResponse } from "next/server";
import { alert, clearAlerts } from "@/lib/alert";

// Admin actions on the alerts (behind the password in proxy.ts): send a test alert, to check
// that the email arrives, or empty the list once everything is handled.
export async function POST(req: NextRequest) {
  const action = String((await req.formData()).get("action") ?? "");
  if (action === "test") await alert(`test:${Date.now()}`, "Alerte de test", ["Tout va bien : c'est le bouton « Envoyer une alerte de test » de l'admin.", "Si tu lis cet email, les alertes arrivent bien."]);
  else if (action === "clear") await clearAlerts();
  return NextResponse.redirect(`${req.nextUrl.origin}/admin#alertes`, 303);
}
