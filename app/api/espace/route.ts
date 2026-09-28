import { NextRequest, NextResponse } from "next/server";
import { redis, redisReady } from "@/lib/redis";
import { mailReady, sendLoginCode } from "@/lib/email";
import { alert, why } from "@/lib/alert";
import { ACCESS_COOKIE, cleanRef, findOrder } from "@/lib/access";
import { stripe as stripeClient, toOrder } from "@/lib/feedback";
import { checkCode, cleanEmail, CODE_MINUTES, logLogin, newCode, ordersOf, OTP_COOKIE, otpCookie, readOtpCookie, SESSION_COOKIE, sessionCookie } from "@/lib/client-auth";

// Customer area login (lib/client-auth.ts), in two steps: "envoyer" (the order reference; the email
// of that order gets a 6-digit code; "renvoyer" sends a new one) then "verifier" (the code).
// "sortie" logs out. Sends back to the customer area, with ?etape=code between the steps and
// ?erreur=<reason> when something did not work.
const NEXT = /^\/(fr|en)\/exercices(\/[a-z0-9-]+){0,2}$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = form.get("lang") === "en" ? "en" : "fr";
  const next = NEXT.test(String(form.get("next"))) ? String(form.get("next")) : "";
  const page = (q: Record<string, string> = {}) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/espace-client?${new URLSearchParams({ ...q, ...(next ? { next } : {}) })}`, 303);
  const opts = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/" };
  const action = String(form.get("action") ?? "");

  // Logging out also closes the library on this device (its place among the devices of the
  // order is kept: the next login reopens it without using another one). "sortie" alone was the
  // button of an earlier version of the page.
  if (action === "sortie" || form.get("sortie")) {
    const res = page();
    for (const c of [SESSION_COOKIE, ACCESS_COOKIE, "6m_cli"]) res.cookies.set(c, "", { ...opts, maxAge: 0 });
    return res;
  }
  // 10 tries per hour and per connection, so emails and codes cannot be guessed.
  if (redisReady()) {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?";
    const k = `rl:esp:${ip}:${Math.floor(Date.now() / 3600000)}`;
    try {
      const [n] = await redis([["INCR", k], ["EXPIRE", k, 3600]]);
      if (Number(n) > 10) return page({ erreur: "trop" });
    } catch {}
  }
  const s = stripeClient();
  if (!s || !mailReady()) return page({ erreur: "indisponible" });

  try {
    // "renvoyer": a new code to the address of the first step (kept in a short signed cookie).
    if (action === "envoyer" || action === "renvoyer") {
      // The order reference (the same way for everyone): the code goes to the email of that order,
      // also when Apple hid the address at payment, as it forwards the email.
      const ref = cleanRef(String(form.get("ref") ?? ""));
      const email = action === "renvoyer" ? readOtpCookie(req.cookies.get(OTP_COOKIE)?.value) : ref.length === 12 ? await orderEmail(s, ref) : null;
      if (action === "envoyer" && !email) {
        await logLogin(`${ref || "vide"}@reference`, "référence inconnue : pas de code envoyé");
        return page({ etape: "code" });
      }
      if (!email) return page({ erreur: "expire" });
      // The page says the same whether the reference exists or not, so it does not tell who is a customer.
      const orders = await ordersOf(s, email, action === "envoyer");
      if (!orders.length) await logLogin(email, "aucune commande à cette adresse : pas de code envoyé");
      else {
        const c = await newCode(email);
        if ("error" in c) {
          await logLogin(email, c.error === "trop" ? "trop de codes demandés (5 par heure)" : "codes indisponibles (Redis)");
          return page({ etape: "code", erreur: c.error });
        }
        try {
          const answer = await sendLoginCode(email, lang, c.code, CODE_MINUTES, orders[orders.length - 1].meta.firstName ?? "");
          await logLogin(email, `${action === "renvoyer" ? "code renvoyé" : "code envoyé"} (serveur mail : ${answer})`);
        } catch (e) {
          await logLogin(email, `erreur d'envoi : ${why(e)}`);
          throw e;
        }
      }
      const res = page({ etape: "code", ...(action === "renvoyer" ? { renvoye: "1" } : {}) });
      res.cookies.set(OTP_COOKIE, otpCookie(email), { ...opts, maxAge: CODE_MINUTES * 60 });
      return res;
    }
    if (action === "verifier") {
      const email = readOtpCookie(req.cookies.get(OTP_COOKIE)?.value);
      if (!email) return page({ erreur: "expire" });
      const r = await checkCode(email, String(form.get("code") ?? "").replace(/\D/g, ""));
      await logLogin(email, r === "ok" ? "connecté" : r === "faux" ? "mauvais code" : "code expiré ou trop essayé");
      if (r !== "ok") return page(r === "faux" ? { etape: "code", erreur: "faux" } : { erreur: "expire" });
      const res = page();
      res.cookies.set(SESSION_COOKIE, sessionCookie(email), opts);
      res.cookies.set(OTP_COOKIE, "", { ...opts, maxAge: 0 });
      return res;
    }
    return page();
  } catch (e) {
    await alert("espace-login", "Espace client : la connexion n'a pas fonctionné", [`Étape : ${action}`, `Erreur : ${why(e)}`]);
    return page({ erreur: "indisponible" });
  }
}

// The email of the order with this reference, or null.
async function orderEmail(s: NonNullable<ReturnType<typeof stripeClient>>, ref: string): Promise<string | null> {
  const o = await findOrder(s, ref);
  if (!o || o.refunded) return null;
  const e = toOrder(await s.paymentIntents.retrieve(o.pi, { expand: ["latest_charge"] })).email;
  return e ? cleanEmail(e) : null;
}
