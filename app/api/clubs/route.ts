import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { validEmail } from "@/lib/leads";
import { redis, redisReady } from "@/lib/redis";
import { cleanSrc } from "@/lib/analytics";
import { mailReady, sendClubRequest } from "@/lib/email";
import { CLUB_GEAR, CLUB_PLACES, whenLabel } from "@/lib/club-equipment";

// Quote request from the Clubs page: emailed to 6M Lab (reply goes straight to the coach).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const page = (q: string) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/clubs?${q}#devis`, 303);
  const get = (k: string, max = 120) => String(form.get(k) ?? "").trim().slice(0, max);
  // "site" is left empty by people and filled in by spam bots.
  if (form.get("site")) return page("envoye=1");
  const r = { name: get("name"), role: get("role"), club: get("club"), email: get("email", 254).toLowerCase(), size: get("size"), side: get("side"), category: get("category"), level: get("level"), period: get("period"), message: get("message", 2000), src: cleanSrc(get("src") || "direct"), lang };
  // Facilities and equipment, with when each is available ("Gymnase : pré-saison et saison").
  const kit = (list: readonly (readonly [string, string, string])[]) => list.map(([id, name]) => [name, whenLabel(form.getAll(`eq_${id}`).map(String))]).filter(([, w]) => w).map(([n, w]) => `${n} : ${w}`);
  const equipment = { places: kit(CLUB_PLACES), gear: kit(CLUB_GEAR), other: get("eq_autre", 200) };
  if (!r.name || !r.club || !r.side || !r.category || !validEmail(r.email)) return page("erreur=1");
  // 5 requests per hour and per connection.
  if (redisReady()) {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?";
    const key = `rl:club:${ip}:${Math.floor(Date.now() / 3600000)}`;
    try {
      const [n] = await redis([["INCR", key], ["EXPIRE", key, 3600]]);
      if (Number(n) > 5) return page("erreur=1");
    } catch {}
  }
  if (!mailReady()) return page("erreur=1");
  try {
    await sendClubRequest(r, equipment);
    return page("envoye=1");
  } catch (e) {
    console.error("[clubs]", e);
    return page("erreur=1");
  }
}
