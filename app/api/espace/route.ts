import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/feedback";
import { redis, redisReady } from "@/lib/redis";
import { validEmail } from "@/lib/leads";
import { mailReady, sendLoginCode } from "@/lib/email";
import { alert, why } from "@/lib/alert";
import { checkCode, cleanEmail, CODE_MINUTES, newCode, ordersOf, OTP_COOKIE, otpCookie, readOtpCookie, SESSION_COOKIE, sessionCookie } from "@/lib/client-auth";

// Customer area login (lib/client-auth.ts), in two steps: "envoyer" (the email of the order, which
// gets a 6-digit code) then "verifier" (the code). "sortie" logs out. Sends back to the customer
// area, with ?etape=code between the steps and ?erreur=<reason> when something did not work.
const NEXT = /^\/(fr|en)\/exercices(\/[a-z0-9-]+){0,2}$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = form.get("lang") === "en" ? "en" : "fr";
  const next = NEXT.test(String(form.get("next"))) ? String(form.get("next")) : "";
  const page = (q: Record<string, string> = {}) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/espace-client?${new URLSearchParams({ ...q, ...(next ? { next } : {}) })}`, 303);
  const opts = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/" };
  const action = String(form.get("action") ?? "");

  if (action === "sortie") {
    const res = page();
    res.cookies.set(SESSION_COOKIE, "", { ...opts, maxAge: 0 });
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
  const s = stripe();
  if (!s || !mailReady()) return page({ erreur: "indisponible" });

  try {
    if (action === "envoyer") {
      const email = cleanEmail(String(form.get("email") ?? ""));
      if (!validEmail(email)) return page({ erreur: "email" });
      // A code is sent only to an email that has an order; the page says the same either way,
      // so it does not tell who is a customer.
      if ((await ordersOf(s, email, true)).length) {
        const c = await newCode(email);
        if ("error" in c) return page({ erreur: c.error });
        await sendLoginCode(email, lang, c.code, CODE_MINUTES);
      }
      const res = page({ etape: "code" });
      res.cookies.set(OTP_COOKIE, otpCookie(email), { ...opts, maxAge: CODE_MINUTES * 60 });
      return res;
    }
    if (action === "verifier") {
      const email = readOtpCookie(req.cookies.get(OTP_COOKIE)?.value);
      if (!email) return page({ erreur: "expire" });
      const r = await checkCode(email, String(form.get("code") ?? "").replace(/\D/g, ""));
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
