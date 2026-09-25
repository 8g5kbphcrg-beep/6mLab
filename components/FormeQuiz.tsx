"use client";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/dict";
import Silhouette from "@/components/Silhouette";
import {
  ageAdaptations, current, FEEL_BETTER, goalBlocked, goalCaution, goalIds, goals, levels, pains, suggestGoal, targets, zones,
  type FitGoal, type Sex,
} from "@/lib/forme";
import { legalPaths } from "@/lib/legal";

// Fitness & well-being questionnaire: one question per screen, then a summary of the program and
// the waiting list form (the answers are saved with the email).

type A = {
  name: string; age: string; sex: Sex | ""; cur: number; target: number; goal: FitGoal | ""; zone: string;
  level: string; place: string; freq: string; dur: string; pain: string[]; height: string; weight: string; consent: boolean;
};
const empty: A = { name: "", age: "", sex: "", cur: -1, target: -1, goal: "", zone: "", level: "", place: "", freq: "", dur: "", pain: [], height: "", weight: "", consent: false };

const House = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Dumbbell = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;

export default function FormeQuiz({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  const [a, setA] = useState<A>(empty);
  const [step, setStep] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const set = <K extends keyof A>(k: K, v: A[K]) => setA((x) => ({ ...x, [k]: v }));
  const age = Number(a.age) || 0;
  const sex: Sex = a.sex || "n";
  const suggested = a.cur >= 0 && a.target >= 0 ? suggestGoal(a.cur, a.target, age) : "";

  // Pre-select the suggested goal when reaching the goal screen.
  useEffect(() => {
    if (step === 5 && !a.goal && suggested && !goalBlocked(suggested, age)) set("goal", suggested);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const steps: { q: string; hint?: string; ok: boolean; body: React.ReactNode }[] = [
    {
      q: fr ? "Comment tu t'appelles ?" : "What's your name?", hint: fr ? "Pour que ton programme soit vraiment le tien." : "So your program is truly yours.",
      ok: a.name.trim().length > 0,
      body: <input className="fq-in" autoFocus autoComplete="given-name" maxLength={40} placeholder={fr ? "Ton prénom" : "Your first name"} value={a.name} onChange={(e) => set("name", e.target.value)} />,
    },
    {
      q: fr ? `Quel âge as-tu, ${a.name.trim()} ?` : `How old are you, ${a.name.trim()}?`, hint: fr ? "On ne s'entraîne pas de la même façon à 20 ans et à 65 ans." : "You don't train the same way at 20 and at 65.",
      ok: age >= 12 && age <= 99,
      body: <input className="fq-in fq-age" type="number" inputMode="numeric" min={12} max={99} placeholder={fr ? "Âge" : "Age"} value={a.age} onChange={(e) => set("age", e.target.value)} />,
    },
    {
      q: fr ? "Quelles silhouettes te ressemblent le plus ?" : "Which silhouettes look most like you?",
      ok: !!a.sex,
      body: (
        <div className="fq-opts fq-3">
          {([["f", fr ? "Femme" : "Woman"], ["h", fr ? "Homme" : "Man"], ["n", fr ? "Je préfère ne pas le préciser" : "I'd rather not say"]] as [Sex, string][]).map(([k, l]) => (
            <button key={k} type="button" className="fq-opt" aria-pressed={a.sex === k} onClick={() => set("sex", k)}>{l}</button>
          ))}
        </div>
      ),
    },
    {
      q: fr ? "Ta silhouette aujourd'hui" : "Your body today", hint: fr ? "Celle qui s'en rapproche le plus. Pas de jugement, c'est juste un point de départ." : "The closest one. No judgement, it's just a starting point.",
      ok: a.cur >= 0,
      body: (
        <>
        <p className="fq-swipe">{fr ? "Fais défiler pour tout voir →" : "Swipe to see them all →"}</p>
        <div className="fq-sils">
          {current.map((l, i) => (
            <button key={i} type="button" className="fq-sil" aria-pressed={a.cur === i} onClick={() => set("cur", i)}>
              <Silhouette sex={sex} kind="cur" i={i} /><span>{l[lang]}</span>
            </button>
          ))}
        </div>
        </>
      ),
    },
    {
      q: fr ? "La silhouette que tu vises" : "The body you're aiming for",
      ok: a.target >= 0,
      body: (
        <>
          <p className="fq-swipe">{fr ? "Fais défiler pour tout voir →" : "Swipe to see them all →"}</p>
          <div className="fq-sils">
            {targets.map((l, i) => (
              <button key={i} type="button" className="fq-sil" aria-pressed={a.target === i} onClick={() => set("target", i)}>
                <Silhouette sex={sex} kind="target" i={i} /><span>{l[lang]}</span>
              </button>
            ))}
          </div>
          <button type="button" className="fq-opt fq-wide" aria-pressed={a.target === FEEL_BETTER} onClick={() => set("target", FEEL_BETTER)}>
            {fr ? "Pas de silhouette précise : juste me sentir mieux" : "No specific body: just feel better"}
          </button>
        </>
      ),
    },
    {
      q: fr ? "Ton objectif" : "Your goal", hint: fr ? "D'après tes réponses, on te suggère un objectif. Tu peux en choisir un autre." : "Based on your answers, we suggest a goal. You can pick another one.",
      ok: !!a.goal && !goalBlocked(a.goal, age),
      body: (
        <>
          <div className="fq-goals">
            {goalIds.map((g) => {
              const blocked = goalBlocked(g, age);
              return (
                <button key={g} type="button" className="fq-goal" disabled={blocked} aria-pressed={a.goal === g} onClick={() => set("goal", g)}>
                  <strong>{goals[g].name[lang]}{g === suggested && !blocked && <b className="fq-sug">{fr ? "Suggéré pour toi" : "Suggested for you"}</b>}</strong>
                  <span>{blocked ? (fr ? "Pas proposé avant 18 ans." : "Not offered under 18.") : goals[g].desc[lang]}</span>
                </button>
              );
            })}
          </div>
          {a.goal && goalCaution(a.goal, a.cur) && (
            <p className="fq-care">{fr
              ? "Ta silhouette est déjà fine : plutôt que de perdre du poids, on te conseille « Tonifier et raffermir » ou « Me remettre en forme ». Si tu as un doute, parles-en à un professionnel de santé."
              : "Your body is already slim: rather than losing weight, we suggest “Tone up” or “Get back in shape”. If in doubt, talk to a health professional."}</p>
          )}
          <p className="fq-lab">{fr ? "Une zone à travailler en priorité ? (facultatif)" : "A priority area? (optional)"}</p>
          <div className="fq-chips">
            {Object.entries(zones).map(([k, l]) => (
              <button key={k} type="button" className="fq-chip" aria-pressed={a.zone === k} onClick={() => set("zone", a.zone === k ? "" : k)}>{l[lang]}</button>
            ))}
          </div>
        </>
      ),
    },
    {
      q: fr ? "Où en es-tu ?" : "Where are you at?",
      ok: !!a.level,
      body: (
        <div className="fq-list">
          {Object.entries(levels).map(([k, l]) => (
            <button key={k} type="button" className="fq-goal" aria-pressed={a.level === k} onClick={() => set("level", k)}>
              <strong><span className="fq-ico" aria-hidden="true">{l.icon}</span>{l.name[lang]}</strong><span>{l.desc[lang]}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      q: fr ? "Où vas-tu t'entraîner ?" : "Where will you train?", hint: fr ? "Tu recevras le programme adapté à ton lieu d'entraînement." : "You'll get the program adapted to where you train.",
      ok: !!a.place,
      body: (
        <div className="fq-place">
          <button type="button" className="fq-pl" aria-pressed={a.place === "maison"} onClick={() => set("place", "maison")}>
            <House /><strong>{fr ? "Maison" : "Home"}</strong><span>{fr ? "Poids du corps, avec des variantes élastique si tu en as un" : "Bodyweight, with band variations if you have one"}</span>
          </button>
          <button type="button" className="fq-pl" aria-pressed={a.place === "salle"} onClick={() => set("place", "salle")}>
            <Dumbbell /><strong>{fr ? "Salle" : "Gym"}</strong><span>{fr ? "Haltères, barres et machines" : "Dumbbells, barbells and machines"}</span>
          </button>
        </div>
      ),
    },
    {
      q: fr ? "Combien de temps as-tu ?" : "How much time do you have?",
      ok: !!a.freq && !!a.dur,
      body: (
        <>
          <p className="fq-lab">{fr ? "Séances par semaine" : "Sessions per week"}</p>
          <div className="fq-chips">{["2", "3", "4"].map((k) => <button key={k} type="button" className="fq-chip fq-big" aria-pressed={a.freq === k} onClick={() => set("freq", k)}>{k}</button>)}</div>
          <p className="fq-lab">{fr ? "Durée d'une séance" : "Session length"}</p>
          <div className="fq-chips">{["30", "45", "60"].map((k) => <button key={k} type="button" className="fq-chip fq-big" aria-pressed={a.dur === k} onClick={() => set("dur", k)}>{k} min</button>)}</div>
        </>
      ),
    },
    {
      q: fr ? "Des douleurs ou des gênes ?" : "Any pain or discomfort?", hint: fr ? "On remplacera les exercices qui pourraient les réveiller." : "We'll replace the exercises that could trigger them.",
      ok: a.pain.length > 0 && a.consent,
      body: (
        <>
          <div className="fq-chips">
            {Object.entries(pains).map(([k, l]) => (
              <button key={k} type="button" className="fq-chip" aria-pressed={a.pain.includes(k)}
                onClick={() => set("pain", a.pain.includes(k) ? a.pain.filter((x) => x !== k) : [...a.pain.filter((x) => x !== "aucune"), k])}>{l[lang]}</button>
            ))}
            <button type="button" className="fq-chip" aria-pressed={a.pain.includes("aucune")} onClick={() => set("pain", ["aucune"])}>{fr ? "Aucune" : "None"}</button>
          </div>
          <p className="fq-lab">{fr ? "Ta taille et ton poids (facultatif, pour affiner ton programme)" : "Height and weight (optional, to fine-tune your program)"}</p>
          <div className="fq-hw">
            <label>{fr ? "Taille" : "Height"}<span><input type="number" inputMode="numeric" min={120} max={230} value={a.height} onChange={(e) => set("height", e.target.value)} /> cm</span></label>
            <label>{fr ? "Poids" : "Weight"}<span><input type="number" inputMode="numeric" min={30} max={250} value={a.weight} onChange={(e) => set("weight", e.target.value)} /> kg</span></label>
          </div>
          <label className="fq-consent">
            <input type="checkbox" checked={a.consent} onChange={() => set("consent", !a.consent)} />
            <span>{fr ? "J'accepte que ces informations (silhouette, douleurs, taille et poids) servent uniquement à adapter mon programme." : "I agree that this information (body type, pain, height and weight) is used only to adapt my program."} <a href={legalPaths[lang].privacy} target="_blank">{fr ? "Confidentialité" : "Privacy"}</a></span>
          </label>
        </>
      ),
    },
  ];

  const last = steps.length;
  const go = (d: number) => { setStep((s) => s + d); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const cur = steps[step];
  const g = a.goal as FitGoal;
  const adapt = [...ageAdaptations(age, lang), ...(a.pain.filter((p) => p !== "aucune").length ? [fr ? `Exercices adaptés : ${a.pain.filter((p) => p !== "aucune").map((p) => pains[p][lang].toLowerCase()).join(", ")}` : `Adapted exercises: ${a.pain.filter((p) => p !== "aucune").map((p) => pains[p][lang].toLowerCase()).join(", ")}`] : [])];

  return (
    <div className="fq" ref={top}>
      <div className="fq-prog" aria-hidden="true"><i style={{ width: `${(Math.min(step, last) / last) * 100}%` }} /></div>
      {step < last ? (
        <section className="fq-step" key={step}>
          <p className="fq-n">{fr ? "Question" : "Question"} {step + 1} / {last}</p>
          <h1>{cur.q}</h1>
          {cur.hint && <p className="fq-hint">{cur.hint}</p>}
          <div className="fq-body">{cur.body}</div>
          <div className="fq-nav">
            {step > 0 && <button type="button" className="fq-back" onClick={() => go(-1)}>← {fr ? "Retour" : "Back"}</button>}
            <button type="button" className="btn fq-next" disabled={!cur.ok} onClick={() => go(1)}>{step === last - 1 ? (fr ? "Voir mon programme" : "See my program") : (fr ? "Continuer" : "Continue")}</button>
          </div>
        </section>
      ) : (
        <section className="fq-step fq-res">
          <p className="fq-n">{fr ? "Ton programme" : "Your program"}</p>
          <h1>{fr ? `${a.name.trim()}, voici ton programme` : `${a.name.trim()}, here's your program`}</h1>
          <div className="fq-card">
            <p className="fq-goalname">{goals[g].name[lang]}</p>
            <ul className="fq-sum">
              <li><span>{fr ? "Niveau" : "Level"}</span>{levels[a.level].icon} {levels[a.level].name[lang]}</li>
              <li><span>{fr ? "Lieu" : "Place"}</span>{a.place === "maison" ? (fr ? "🏠 Maison" : "🏠 Home") : (fr ? "🏋️ Salle" : "🏋️ Gym")}</li>
              <li><span>{fr ? "Rythme" : "Schedule"}</span>{a.freq} × {a.dur} min {fr ? "par semaine" : "per week"}</li>
              <li><span>{fr ? "Durée" : "Length"}</span>{fr ? "12 semaines" : "12 weeks"}</li>
              {a.zone && <li><span>{fr ? "Priorité" : "Priority"}</span>{zones[a.zone][lang]}</li>}
            </ul>
            {adapt.length > 0 && <><p className="fq-lab">{fr ? "Adapté pour toi" : "Adapted for you"}</p><ul className="fq-adapt">{adapt.map((x) => <li key={x}>{x}</li>)}</ul></>}
          </div>
          <div className="fq-wait">
            <p className="fq-st">{fr ? "Lancement prochainement" : "Launching soon"}</p>
            <p>{fr ? "Le programme Forme & bien-être est en préparation. Laisse ton email : tu seras prévenu(e) dès le lancement, et ton programme sera prêt avec tes réponses." : "The Fitness & well-being program is being prepared. Leave your email: you'll hear from us on launch day, and your program will be ready with your answers."}</p>
            <form method="post" action="/api/liste-attente" className="notify">
              <input type="hidden" name="lang" value={lang} />
              <input className="sr" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {Object.entries({ q_name: a.name.trim(), q_age: a.age, q_sex: a.sex, q_cur: String(a.cur), q_target: String(a.target), q_goal: a.goal, q_zone: a.zone, q_level: a.level, q_place: a.place, q_freq: a.freq, q_dur: a.dur, q_pain: a.pain.join("+"), q_height: a.height, q_weight: a.weight, q_consent: a.consent ? "1" : "" })
                .map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
              <label className="sr" htmlFor="fq-email">Email</label>
              <input id="fq-email" name="email" type="email" required autoComplete="email" placeholder={fr ? "Ton adresse email" : "Your email address"} />
              <button className="btn" type="submit">{fr ? "Préviens-moi du lancement" : "Tell me when it launches"}</button>
              <p className="note">{fr ? "Un seul email, le jour du lancement. Désinscription en un clic." : "One email, on launch day. Unsubscribe in one click."}</p>
            </form>
          </div>
          <button type="button" className="fq-back" onClick={() => go(-1)}>← {fr ? "Modifier mes réponses" : "Change my answers"}</button>
        </section>
      )}
    </div>
  );
}
