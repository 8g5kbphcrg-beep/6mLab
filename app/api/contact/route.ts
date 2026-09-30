import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { validEmail } from "@/lib/leads";
import { redis, redisReady } from "@/lib/redis";
import { cleanSrc } from "@/lib/analytics";
import { mailReady, sendAck, sendContact } from "@/lib/email";
import { alert, why } from "@/lib/alert";
import { TOPICS } from "@/lib/replies";

// Contact page form: the message goes to 6M Lab (replying answers the customer), and the customer
// gets an acknowledgement right away (lib/email.ts, sendAck).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const page = (q: string) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/contact?${q}#ecrire`, 303);
  const get = (k: string, max = 120) => String(form.get(k) ?? "").trim().slice(0, max);
  // "site" is left empty by people and filled in by spam bots.
  if (form.get("site")) return page("envoye=1");
  const topics: readonly string[] = TOPICS[lang];
  const m = { email: get("email", 254).toLowerCase(), topic: topics.includes(get("topic")) ? get("topic") : topics[topics.length - 1], ref: get("ref", 40).replace(/[^A-Za-z0-9_-]/g, ""), message: get("message", 4000), lang, src: cleanSrc(get("src") || "direct") };
  if (!validEmail(m.email) || m.message.length < 5) return page("erreur=1");
  // 5 messages per hour and per connection.
  if (redisReady()) {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?";
    const key = `rl:contact:${ip}:${Math.floor(Date.now() / 3600000)}`;
    try {
      const [n] = await redis([["INCR", key], ["EXPIRE", key, 3600]]);
      if (Number(n) > 5) return page("erreur=trop");
    } catch {}
  }
  if (!mailReady()) return page("erreur=1");
  try {
    await sendContact(m);
  } catch (e) {
    console.error("[contact]", e);
    await alert("contact", "Un message de la page Contact n'a pas pu être envoyé", [`De : ${m.email}`, `Sujet : ${m.topic}${m.ref ? ` (commande ${m.ref})` : ""}`, `Message : ${m.message}`, `Erreur : ${why(e)}`, "", "Réponds-lui directement à son adresse : il a vu un message d'erreur."]);
    return page("erreur=1");
  }
  // The acknowledgement is a courtesy: if it fails, the message has still reached 6M Lab.
  await sendAck(m.email, lang, "contact", m.message).catch((e) => console.error("[contact] accusé", e));
  return page("envoye=1");
}
