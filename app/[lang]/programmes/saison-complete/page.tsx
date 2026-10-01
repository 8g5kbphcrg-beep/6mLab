import type { Metadata } from "next";
import Link from "next/link";
import { offerRating } from "@/lib/reviews";
import ProductVideo from "@/components/ProductVideo";
import { notFound } from "next/navigation";
import Reviews from "@/components/Reviews";
import BuyForm from "@/components/BuyForm";
import BuyReassure from "@/components/BuyReassure";
import { dict, type Lang } from "@/lib/dict";
import { programs } from "@/lib/programs";
import { fmtPrice, testMode } from "@/lib/checkout";
import { dayLabel, PACK_FULL, PACK_PRICE, quote } from "@/lib/season-parts";
import { validGoals } from "@/lib/goals";
import { Ld, offerLd } from "@/lib/seo";
import "@/app/programme.css";

// The "Saison complète": the next 3 parts of the season in a row (lib/season-parts.ts), same
// goals, 20 % off. It starts with the part under way (or the next one during the June break).
type P = { params: Promise<{ lang: string }>; searchParams?: Promise<{ paiement?: string; objectifs?: string }> };

// Rebuilt every hour at most, to show newly published reviews and today's offer.
export const revalidate = 3600;

const text = {
  fr: {
    tag: "Toute la saison", name: "Saison complète", meta: "3 parties à la suite · 49 semaines · juillet à mi-juin",
    pitch: "Une saison ne se gagne pas en 2 mois : les progrès de l'été se gardent si on les entretient, et chaque partie prépare la suivante. Les 3 parties à la suite, avec les mêmes objectifs, 20 % moins cher.",
    save: (s: string) => `${s} d'économie`,
    includes: [
      "Les 3 parties de la saison, dans l'ordre : celle qui est en cours (ou la prochaine) et les deux suivantes",
      "Les mêmes objectifs du début à la fin : 1 au choix, +5 € pour un 2e",
      "Une animation pour chaque exercice, en ligne pendant toute ta saison + 2 semaines",
      "En option : un programme de course à pied (+9 €)",
    ],
    why: "Pourquoi les 3 parties ?",
    whyD: "La pré-saison construit, la 1re partie entretient avec les matchs en plus, la 2e partie te garde frais jusqu'aux matchs décisifs. S'arrêter après 2 ou 4 mois, c'est perdre en quelques semaines une bonne partie de ce que tu as construit.",
    faq: [
      { q: "La saison a déjà commencé, ça marche quand même ?", a: "Oui : la Saison complète commence par la partie en cours. Au paiement, tu choisis de la prendre en entier ou à partir de la semaine où on en est, au prix des semaines qui restent. Les deux parties suivantes s'enchaînent ensuite." },
      { q: "Je reçois tout d'un coup ?", a: "Tu reçois la partie en cours tout de suite. Les parties suivantes arrivent par email avant leur début, pour que tu gardes le bon document au bon moment." },
      { q: "Combien j'économise ?", a: (s: string, full: string, pack: string) => `${pack} au lieu de ${full} en achetant les 3 parties séparément, soit ${s} d'économie.` },
      { q: "Je peux être remboursé ?", a: "Non, une fois un programme envoyé : tu gardes les PDF. Le détail est dans les CGV." },
    ],
    breakdown: "Tes 3 parties", back: "Comparer les formules", quiz: ["Tu hésites sur tes objectifs ?", "Fais le questionnaire"],
    now: "En cours", from: (d: string) => `À partir du ${d}`,
  },
  en: {
    tag: "The whole season", name: "Full season", meta: "3 parts in a row · 49 weeks · July to mid-June",
    pitch: "A season isn't won in 2 months: the progress of the summer only lasts if you maintain it, and each part prepares the next. The 3 parts in a row, same goals, 20% cheaper.",
    save: (s: string) => `save ${s}`,
    includes: [
      "The 3 parts of the season, in order: the one under way (or the next one) and the two after it",
      "The same goals from start to finish: pick 1, +€5 for a 2nd",
      "An animation for every exercise, online for your whole season + 2 weeks",
      "Optional: a running program (+€9)",
    ],
    why: "Why the 3 parts?",
    whyD: "The pre-season builds, the first half maintains with games on top, the second half keeps you fresh until the decisive games. Stopping after 2 or 4 months means losing much of what you built within a few weeks.",
    faq: [
      { q: "The season has already started, does it still work?", a: "Yes: the Full season starts with the part under way. At checkout you choose to take it whole or from the current week, at the price of the weeks left. The next two parts then follow." },
      { q: "Do I get everything at once?", a: "You get the current part straight away. The next parts arrive by email before they start, so you have the right document at the right time." },
      { q: "How much do I save?", a: (s: string, full: string, pack: string) => `${pack} instead of ${full} when buying the 3 parts separately: you save ${s}.` },
      { q: "Can I get a refund?", a: "No, once a program has been sent: you keep the PDFs. The details are in the terms of sale." },
    ],
    breakdown: "Your 3 parts", back: "Compare the programs", quiz: ["Not sure about your goals?", "Take the questionnaire"],
    now: "Under way", from: (d: string) => `From ${d}`,
  },
};

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  const t = text[lang as Lang];
  const title = lang === "fr" ? `${t.name} handball : les 3 parties de la saison | 6M Lab` : `Handball ${t.name.toLowerCase()}: the 3 parts of the season | 6M Lab`;
  return { title, description: t.pitch, alternates: { canonical: `/${lang}/programmes/saison-complete`, languages: { fr: "/fr/programmes/saison-complete", en: "/en/programmes/saison-complete" } } };
}

export default async function SaisonComplete({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const l = lang as Lang;
  const t = text[l];
  const q = quote("pack");
  const [full$, pack$, save$] = [fmtPrice(PACK_FULL, l), fmtPrice(PACK_PRICE, l), fmtPrice(PACK_FULL - PACK_PRICE, l)];
  const sp = await searchParams;
  const goals = sp?.objectifs?.split(",") ?? [];
  return (
    <div className="prog">
      <Ld data={offerLd(`${t.name} · 6M Lab`, t.pitch, PACK_PRICE, `/${l}/programmes/saison-complete`, await offerRating("pack"))} />
      <Link className="pback" href={`/${l}/programmes`}>← {t.back}</Link>
      <div className="pgrid">
        <header className="phead">
          <span className="ptag p">{t.tag}</span>
          <h1>{t.name}</h1>
          <p className="pmeta2">{t.meta}</p>
          <p className="pprice2"><strong>{pack$}</strong><s>{full$}</s><span>{t.save(save$)}</span></p>
          <p className="plead">{t.pitch}</p>
          <ul className="pinc p">{t.includes.map((i) => <li key={i}>{i}</li>)}</ul>
        </header>
        <aside className="pside">
          <BuyForm lang={l} slug={q.slots[0].part} q={q} pack goals={validGoals(goals) ? goals : []} test={testMode} error={sp?.paiement} />
          <p className="pquiz">{t.quiz[0]} <Link href={`/${l}/questionnaire`}>{t.quiz[1]}</Link></p>
        </aside>
        <div className="pmain">
          {/* French only: the video shows the French PDF pages. */}
          {l === "fr" && <section>
            <h2>Le programme en 30 secondes</h2>
            <ProductVideo />
          </section>}
          <section>
            <h2>{t.breakdown}</h2>
            {q.slots.map((sl) => {
              const p = programs[l][sl.part];
              return (
                <div key={sl.part} className={p.color === "a" ? "phase" : `phase ${p.color}`}>
                  <h3>{p.name} · {sl.current ? t.now : t.from(`${dayLabel(sl.start, l)} ${new Date(sl.start).getUTCFullYear()}`)}</h3>
                  <p>{p.duration} · {p.freq}. {p.pitch}</p>
                </div>
              );
            })}
          </section>
          <section>
            <h2>{t.why}</h2>
            <p>{t.whyD}</p>
          </section>
          <section>
            <h2>FAQ</h2>
            <div className="faq">
              {t.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{typeof f.a === "string" ? f.a : f.a(save$, full$, pack$)}</p>
                </details>
              ))}
            </div>
          </section>
          <p className="note">{dict[l].why.note}</p>
        </div>
        <BuyReassure lang={l} weeks={null} />
      </div>
      <Reviews lang={l} offer="pack" />
    </div>
  );
}
