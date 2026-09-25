import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/feedback";
import { validUnsub } from "@/lib/leads";

// One-click unsubscribe from the free session emails (link in every email, and the
// List-Unsubscribe header, which mail apps call with POST).
async function unsubscribe(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const id = q.get("c") ?? "", lang = q.get("lang") === "en" ? "en" : "fr";
  const s = stripe();
  let ok = false;
  if (s && id.startsWith("cus_") && validUnsub(id, q.get("t") ?? "")) {
    try { await s.customers.update(id, { metadata: { unsub: "1" } }); ok = true; } catch (e) { console.error("[desinscription]", e); }
  }
  return NextResponse.redirect(`${req.nextUrl.origin}/${lang}/desinscription${ok ? "" : "?erreur=1"}`, 303);
}
export const GET = unsubscribe;
export const POST = unsubscribe;
