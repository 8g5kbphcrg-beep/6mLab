import { notFound } from "next/navigation";
import Link from "next/link";
import { dict, type Lang } from "@/lib/dict";
import { SLOGAN } from "@/lib/brand";
import { fmtPrice, prices } from "@/lib/checkout";
import Reviews from "@/components/Reviews";
import { Founder } from "@/components/HomeSections";
import { Anim } from "@/components/BlogBits";
import "@/app/home.css";
import "@/app/portal.css";

// Home page: what 6M Lab is, then the two families of programs. Sport-specific preparation
// (handball now, other sports soon) and fitness & well-being for everyone (in preparation).
export const revalidate = 3600;

const t = {
  fr: {
    h1: "Ton corps, ton rythme, ton programme",
    lead: "Que tu prépares une saison ou que tu veuilles simplement te sentir mieux : des séances planifiées, adaptées à ton niveau et à ton temps, avec chaque exercice animé.",
    cta: "Choisis ton programme",
    trust: ["Adapté à ton niveau", "Chaque exercice animé", "Paiement sécurisé"],
    choose: "Choisis le programme qui te correspond",
    chooseSub: "Deux façons de t'entraîner avec 6M Lab.",
    spec: { k: "Préparation spécifique", h: "La prépa physique du haut niveau, pour ton sport", p: "Des programmes construits pour les exigences de ton sport : sauts, appuis, duels, prévention des blessures, avant et pendant la saison." },
    hb: { name: "Handball", meta: (p: string) => `Pré-saison, Maintien en saison, Pack Saison complète · dès ${p}`, go: "Découvrir le handball" },
    soon: "Bientôt disponible",
    sports: [["⚽", "Football"], ["🏀", "Basketball"], ["🥊", "Sports de combat"]],
    fit: {
      k: "Accessible à tous", h: "Forme & bien-être", p: "Pas besoin d'être sportif : un programme pour te remettre en forme, à ton rythme, sans objectif de performance.",
      goals: ["Perdre du poids", "Prendre du muscle", "Me remettre en forme", "Tonifier", "Dos & posture", "Équilibre & autonomie"],
      where: "Chez toi ou à la salle, au choix", home: "Maison", homeD: "Poids du corps, variantes élastique", gym: "Salle", gymD: "Haltères et machines",
      status: "En préparation", quiz: "Réponds au questionnaire pour trouver ton programme", quizNote: "10 questions · 2 minutes · objectif, niveau, lieu et temps disponible",
    },
    why: "Pourquoi 6M Lab",
    whys: [["Planifié", "Chaque semaine est construite pour progresser sans t'épuiser : pas de séances au hasard."], ["Animé", "Chaque exercice a son animation : tu sais exactement quoi faire, même seul."], ["Adapté", "À ton niveau, à ton lieu d'entraînement et au temps que tu as : c'est le programme qui s'adapte à toi."]],
  },
  en: {
    h1: "Your body, your pace, your program",
    lead: "Whether you are preparing a season or simply want to feel better: planned sessions, adapted to your level and your time, with every exercise animated.",
    cta: "Choose your program",
    trust: ["Adapted to your level", "Every exercise animated", "Secure payment"],
    choose: "Choose the program that fits you",
    chooseSub: "Two ways to train with 6M Lab.",
    spec: { k: "Sport-specific preparation", h: "Elite-level physical prep, for your sport", p: "Programs built for the demands of your sport: jumps, footwork, duels, injury prevention, before and during the season." },
    hb: { name: "Handball", meta: (p: string) => `Pre-season, In-season, Full season pack · from ${p}`, go: "Explore handball" },
    soon: "Coming soon",
    sports: [["⚽", "Football"], ["🏀", "Basketball"], ["🥊", "Combat sports"]],
    fit: {
      k: "For everyone", h: "Fitness & well-being", p: "No need to be an athlete: a program to get back in shape at your own pace, with no performance goal.",
      goals: ["Lose weight", "Build muscle", "Get back in shape", "Tone up", "Back & posture", "Balance & independence"],
      where: "At home or at the gym, your choice", home: "Home", homeD: "Bodyweight, band variations", gym: "Gym", gymD: "Dumbbells and machines",
      status: "In preparation", quiz: "Take the questionnaire to find your program", quizNote: "10 questions · 2 minutes · goal, level, place and available time",
    },
    why: "Why 6M Lab",
    whys: [["Planned", "Every week is built to make you progress without wearing you out: no random workouts."], ["Animated", "Every exercise has its animation: you know exactly what to do, even alone."], ["Adapted", "To your level, where you train and the time you have: the program adapts to you."]],
  },
};

const House = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Dumbbell = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const l = lang as Lang;
  const x = t[l];
  const from = fmtPrice(Math.min(...Object.values(prices)), l);
  return (
    <>
      <section className="hero phome">
        <div className="wrap">
          <div>
            <p className="slogan rise">{SLOGAN}</p>
            <h1 className="rise">{x.h1}</h1>
            <p className="lead rise">{x.lead}</p>
            <div className="hcta rise"><a className="btn" href="#formules">{x.cta}</a></div>
            <ul className="trust rise">{x.trust.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="phome-figs rise" aria-hidden="true">
            {["squat-jump", "fente-arriere", "planche"].map((id) => <Anim key={id} id={id} className="phome-fig" />)}
          </div>
        </div>
      </section>

      <section id="formules" className="sec wrap">
        <header className="shead">
          <h2>{x.choose}</h2>
          <p>{x.chooseSub}</p>
        </header>
        <div className="uni">
          <article className="uni-c spec">
            <p className="uni-k">{x.spec.k}</p>
            <h3>{x.spec.h}</h3>
            <p className="uni-p">{x.spec.p}</p>
            <Link href={`/${l}/handball`} className="sport on" data-go>
              <Anim id="lancer-haut" className="sport-fig" />
              <span className="sport-t"><strong>{x.hb.name}</strong><span>{x.hb.meta(from)}</span></span>
              <span className="btn">{x.hb.go} →</span>
            </Link>
            <ul className="soon">
              {x.sports.map(([e, n]) => <li key={n} aria-disabled="true"><span className="soon-e" aria-hidden="true">{e}</span>{n}<b>{x.soon}</b></li>)}
            </ul>
          </article>

          <article className="uni-c fit" id="forme">
            <p className="uni-k">{x.fit.k}</p>
            <h3>{x.fit.h} <b className="uni-st">{x.fit.status}</b></h3>
            <p className="uni-p">{x.fit.p}</p>
            <ul className="fit-goals">{x.fit.goals.map((g) => <li key={g}>{g}</li>)}</ul>
            <p className="fit-where">{x.fit.where}</p>
            <div className="place">
              <span><House /><strong>{x.fit.home}</strong><small>{x.fit.homeD}</small></span>
              <span><Dumbbell /><strong>{x.fit.gym}</strong><small>{x.fit.gymD}</small></span>
            </div>
            <Link href={`/${l}/forme/questionnaire`} className="btn fit-go">{x.fit.quiz}</Link>
            <p className="note fit-note">{x.fit.quizNote}</p>
          </article>
        </div>
      </section>

      <section className="band">
        <div className="sec wrap">
          <header className="shead"><h2>{x.why}</h2></header>
          <ul className="why">{x.whys.map(([h, p]) => <li key={h}><strong>{h}</strong><span>{p}</span></li>)}</ul>
        </div>
      </section>

      <Founder lang={l} />
      <Reviews lang={l} />
    </>
  );
}
