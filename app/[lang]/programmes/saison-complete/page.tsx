import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reviews from "@/components/Reviews";
import BuyForm from "@/components/BuyForm";
import { dict, type Lang } from "@/lib/dict";
import { programs } from "@/lib/programs";
import { fmtPrice, PACK_PRICE, prices, testMode } from "@/lib/checkout";
import { validGoals } from "@/lib/goals";
import "@/app/programme.css";

// The "Saison complète" pack: the Pré-saison, then the Maintien en saison, same goals, one price.
type P = { params: Promise<{ lang: string }>; searchParams?: Promise<{ paiement?: string; objectifs?: string }> };

// Rebuilt every hour at most, to show newly published reviews.
export const revalidate = 3600;

const text = {
  fr: {
    tag: "Toute la saison", name: "Pack Saison complète", meta: "20 semaines · Pré-saison puis Maintien en saison",
    pitch: "Prépare ta reprise, puis garde ton niveau jusqu'à la fin de la saison : les deux programmes, avec les mêmes objectifs, pour un seul prix.",
    save: (s: string) => `${s} d'économie`,
    includes: (pre: string, main: string) => [
      `La Pré-saison : ${pre}`,
      `Le Maintien en saison : ${main}`,
      "Les mêmes objectifs sur les deux programmes : 1 au choix, +5 € pour un 2e",
      "Une animation pour chaque exercice",
      "En option : un programme de course à pied (+9 €)",
    ],
    phases: [
      { t: "Semaines 1 à 8 : Pré-saison", d: "Mise en route, montée en charge, intensité, puis une semaine d'affûtage : tu arrives prêt au premier entraînement collectif." },
      { t: "Semaines 9 à 20 : Maintien en saison", d: "Deux séances courtes par semaine, placées loin des matchs, pour entretenir le travail sur tes objectifs sans te fatiguer." },
    ],
    faq: [
      { q: "Je reçois les deux programmes en même temps ?", a: "Oui, les deux arrivent ensemble par email. Tu commences par la Pré-saison et tu enchaînes avec le Maintien quand les matchs reprennent." },
      { q: "Quand faut-il commencer ?", a: "Idéalement 8 semaines avant la reprise avec ton club. Si la saison a déjà commencé, choisis plutôt le Maintien en saison seul." },
      { q: "Combien j'économise ?", a: (s: string, full: string, pack: string) => `${pack} au lieu de ${full} en achetant les deux séparément, soit ${s} d'économie.` },
    ],
    breakdown: "Le déroulé", back: "Comparer les formules", quiz: ["Tu hésites sur tes objectifs ?", "Fais le questionnaire"],
  },
  en: {
    tag: "The whole season", name: "Full season pack", meta: "20 weeks · Pre-season then In-season maintenance",
    pitch: "Get ready for the restart, then keep your level until the end of the season: both programs, with the same goals, for one price.",
    save: (s: string) => `save ${s}`,
    includes: (pre: string, main: string) => [
      `Pre-season: ${pre}`,
      `In-season maintenance: ${main}`,
      "The same goals in both programs: pick 1, +€5 for a 2nd",
      "An animation for every exercise",
      "Optional: a running program (+€9)",
    ],
    phases: [
      { t: "Weeks 1 to 8: Pre-season", d: "Getting started, building up, intensity, then a taper week: you arrive ready for the first team training." },
      { t: "Weeks 9 to 20: In-season maintenance", d: "Two short sessions a week, placed away from games, to maintain the work on your goals without getting tired." },
    ],
    faq: [
      { q: "Do I get both programs at once?", a: "Yes, both arrive together by email. Start with the Pre-season and move on to the maintenance program when games start." },
      { q: "When should I start?", a: "Ideally 8 weeks before your club's restart. If the season has already started, pick the In-season maintenance program alone." },
      { q: "How much do I save?", a: (s: string, full: string, pack: string) => `${pack} instead of ${full} when buying both separately: you save ${s}.` },
    ],
    breakdown: "The breakdown", back: "Compare the programs", quiz: ["Not sure about your goals?", "Take the questionnaire"],
  },
};

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  const t = text[lang as Lang];
  return { title: `${t.name} | 6M Lab`, description: t.pitch, alternates: { canonical: `/${lang}/programmes/saison-complete` } };
}

export default async function SaisonComplete({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const l = lang as Lang;
  const t = text[l];
  const pre = programs[l]["pre-saison"], main = programs[l]["maintien-saison"];
  const full = prices["pre-saison"] + prices["maintien-saison"];
  const [full$, pack$, save$] = [fmtPrice(full, l), fmtPrice(PACK_PRICE, l), fmtPrice(full - PACK_PRICE, l)];
  const sp = await searchParams;
  const goals = sp?.objectifs?.split(",") ?? [];
  return (
    <div className="prog">
      <Link className="pback" href={`/${l}/programmes`}>← {t.back}</Link>
      <div className="pgrid">
        <header className="phead">
          <span className="ptag p">{t.tag}</span>
          <h1>{t.name}</h1>
          <p className="pmeta2">{t.meta}</p>
          <p className="pprice2"><strong>{pack$}</strong><s>{full$}</s><span>{t.save(save$)}</span></p>
          <p className="plead">{t.pitch}</p>
          <ul className="pinc p">{t.includes(`${pre.duration}, ${pre.freq}`, `${main.duration}, ${main.freq}`).map((i) => <li key={i}>{i}</li>)}</ul>
        </header>
        <aside className="pside">
          <BuyForm lang={l} slug="pre-saison" pack goals={validGoals(goals) ? goals : []} test={testMode} error={sp?.paiement} />
          <p className="pquiz">{t.quiz[0]} <Link href={`/${l}/questionnaire`}>{t.quiz[1]}</Link></p>
        </aside>
        <div className="pmain">
          <section>
            <h2>{t.breakdown}</h2>
            {t.phases.map((ph, i) => (
              <div key={ph.t} className={i ? "phase b" : "phase"}>
                <h3>{ph.t}</h3>
                <p>{ph.d}</p>
              </div>
            ))}
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
      </div>
      <Reviews lang={l} />
    </div>
  );
}
