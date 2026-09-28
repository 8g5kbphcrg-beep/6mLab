import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { owner } from "@/lib/legal";
import ClubTeam from "@/components/ClubTeam";
import ClubEquipment from "@/components/ClubEquipment";
import ClubDrill from "@/components/ClubDrill";
import "@/app/pages.css";
import "@/app/clubs.css";

// Clubs and coaches: the whole team on one program, on quote. The form (app/api/clubs) emails the
// request to 6M Lab, who answers within 48 hours.
type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ envoye?: string; erreur?: string }> };

const text = {
  fr: {
    title: "Clubs et entraîneurs : la prépa physique pour toute l'équipe | 6M Lab",
    desc: "Un programme de préparation physique handball pour tout ton groupe, calé sur le calendrier du club. Presque du sur-mesure, sur devis sous 48 heures.",
    k: "Clubs et entraîneurs", h1: "Toute ton équipe sur le même programme",
    lead: "Des U15 aux seniors, en filière féminine ou masculine. Pré-saison, maintien en saison ou toute la saison : tu reçois tout le programme de ton groupe, et c'est toi qui diriges les séances.",
    time: ["Du temps gagné pour toi", "Pas de préparateur physique au club\u00a0? Tu n'as plus à construire les séances de prépa : elles sont écrites, planifiées sur ton calendrier et chaque exercice est animé. Toi, tu gardes ton temps et ton énergie pour le terrain."],
    care: {
      h: "Ce qu'il faut savoir avant de commencer",
      muscu: ["La musculation chez les jeunes", "Bien menée, la musculation est très bénéfique pour les jeunes, mais elle doit être très bien encadrée. Dans nos programmes club, elle est intégrée à partir des U17 féminines et des U18 masculins. Pour les U15, elle n'est pas recommandée : le travail se fait au poids du corps, avec coordination, gainage, appuis et prévention des blessures."],
      base: ["Les acquis de départ", "Pour chaque catégorie et chaque niveau de jeu, le programme part du principe que certains acquis sont déjà en place : des U15 en départemental n'ont pas le même bagage que des seniors en National. Si, dans le groupe, certains joueurs sont très débutants et loin de ces acquis, le programme ne peut pas combler cet écart à lui seul : c'est à l'entraîneur d'adapter pour eux."],
      coach: ["Des séances dirigées et préparées par le coach", "Le programme ne tourne pas tout seul : la séance doit être managée par l'entraîneur. Il y a des ateliers à installer, des chronos à tenir, des rotations à lancer et des consignes à donner. Et même si chaque séance est quasiment prête, elle demande un temps de préparation : la lire à l'avance, prévoir le matériel et l'installation, former les groupes. Tout est écrit pour que ce soit simple, mais c'est toi qui mènes."],
      adapt: ["Chaque exercice se réadapte", "Pas assez de joueurs à l'entraînement ce soir-là, du matériel qui manque ? Chaque exercice et chaque situation peuvent être réadaptés. On garde l'idée de base du travail (la qualité travaillée, l'intensité, les temps d'effort et de récupération) et on ajuste le reste aux moyens du moment : moins d'ateliers, des groupes plus petits, des plots à la place d'une échelle."],
      level: ["Le niveau de ton effectif", "Des joueurs de National ont plus d'expérience, plus de physique et une meilleure condition que des joueurs de départemental : le programme est calibré sur le niveau de ton équipe. Utiliser un programme prévu pour le National avec une équipe de région est possible, mais seulement en ayant bien conscience du niveau réel de ton effectif et en adaptant les charges."],
    },
    why: [
      ["Adapté à l'âge et à la filière", "Un U15 ne travaille pas comme un U18 ou un senior : le programme suit la catégorie et le niveau de ton équipe."],
      ["Calé sur ton calendrier", "Dates de reprise, matchs, trêve : on place les semaines de prépa autour de tes entraînements."],
      ["Tout le programme sur une seule adresse", "Le programme complet est envoyé à l'entraîneur (ou au club), sur une seule adresse email. Tu partages ensuite avec tes joueurs ce que tu veux."],
      ["Presque du sur-mesure", "Notre plan de base, adapté à ta demande : matériel, calendrier, priorités. Le prix est établi sur devis, selon les adaptations."],
    ],
    more: {
      h: "Bien plus qu'un programme individuel donné à tout le groupe",
      p: "Le programme club est construit pour le collectif et poussé plus loin vers le handball. On reste sur de la vraie préparation physique, avec du renforcement et de la musculation, mais on y ajoute des situations de prépa ludiques qui ressemblent au jeu et qui fonctionnent en groupe.",
      solo: ["Programme individuel", ["Un joueur seul, à la maison ou en salle", "Poids du corps, haltères, élastique", "Chacun à son rythme"]],
      club: ["Programme club", ["Des séances pensées pour tout le groupe : ateliers, circuits, relais, duels", "Des situations ludiques proches du hand : appuis, changements de direction, contacts, tir en fin d'effort", "Avec le matériel du club : plots, échelles de rythme, haies, médecine-balls, élastiques", "L'organisation prête à l'emploi : nombre de joueurs par atelier, rotations, temps d'effort et de récupération", "Construit avec tes installations et ton matériel, en pré-saison comme en saison"]],
    },
    plan: {
      h: "Le déroulé d'une séance type",
      p: "Chaque séance suit la même ligne directrice, pour que le groupe progresse dans le bon ordre. Les exercices changent au fil des semaines, la logique reste.",
      steps: [["Circuit motricité", "Appuis, coordination, changements de direction, réactivité : le corps s'active et travaille les qualités du hand."], ["Circuit renforcement", "Gainage, renforcement et, selon l'âge, musculation : la force qui protège et qui rend explosif."], ["Course", "Travail de la condition physique : intermittent, sprints, courses proches des efforts du match."]],
      custom: "C'est notre plan de base. Ensuite, on l'adapte à ta demande : ton matériel, tes installations, ton calendrier et tes priorités. C'est presque du sur-mesure, c'est pourquoi le prix est établi sur devis.",
    },
    how: ["Tu remplis le formulaire (2 minutes), avec ton matériel et tes installations.", "On échange sur ton groupe, ton niveau, ton calendrier et ton matériel.", "Tu reçois un devis sous 48 heures.", "Une fois validé, tu reçois tout le programme par email, sur une seule adresse."],
    howT: "Comment ça se passe", formT: "Demander un devis",
    f: { name: "Ton prénom et ton nom", role: "Tu es", roles: ["Entraîneur ou entraîneuse", "Préparateur ou préparatrice physique", "Dirigeant ou dirigeante", "Autre"], club: "Club", email: "Ton email", field: "Joueurs de champ", fieldHint: "Arrières, ailiers, demi-centres et pivots", gk: "Gardiens", period: "Quand ?", periods: ["Avant la saison", "Pendant la saison", "Toute la saison"], msg: "Ton message (facultatif)", send: "Envoyer ma demande", privacy: "Ces informations servent uniquement à te répondre et à préparer ton devis." },
    ok: "Merci, ta demande est bien partie ! Je te réponds sous 48 heures par email.", err: "La demande n'a pas pu partir. Vérifie ton email, ou écris-moi directement :",
  },
  en: {
    title: "Clubs and coaches: physical prep for the whole team | 6M Lab",
    desc: "A handball physical preparation program for your whole squad, fitted to your club's calendar. Almost tailor-made, quote within 48 hours.",
    k: "Clubs and coaches", h1: "Your whole team on the same program",
    lead: "From U15 to seniors, women's or men's teams. Pre-season, in-season or the whole season: you get your group's whole program, and you run the sessions.",
    time: ["Time saved for you", "No strength coach at the club? You no longer have to build the training sessions: they are written out, planned around your calendar, and every exercise is animated. You keep your time and energy for the court."],
    care: {
      h: "What to know before you start",
      muscu: ["Weight training for young players", "Done well, weight training is very beneficial for young players, but it must be very well supervised. In our club programs, it starts with U17 girls and U18 boys. For U15s, it is not recommended: the work is done with bodyweight, coordination, core, footwork and injury prevention."],
      base: ["Starting prerequisites", "For each age group and level of play, the program assumes some prerequisites are already in place: county-level U15s do not have the same background as national-level seniors. If some players in the group are complete beginners, far from those prerequisites, the program cannot close that gap on its own: the coach has to adapt for them."],
      coach: ["Sessions run and prepared by the coach", "The program does not run itself: the session has to be managed by the coach. There are stations to set up, timers to keep, rotations to launch and instructions to give. And even though every session is almost ready, it still needs some preparation: read it beforehand, plan the equipment and the set-up, form the groups. Everything is written to make it simple, but you lead."],
      adapt: ["Every exercise can be adapted", "Not enough players at training that evening, some equipment missing? Every exercise and every drill can be adapted. Keep the core idea of the work (the quality trained, the intensity, the work and rest times) and adjust the rest to what you have on the day: fewer stations, smaller groups, cones instead of a ladder."],
      level: ["Your squad's level", "National-level players have more experience, more physical strength and better fitness than county-level players: the program is calibrated on your team's level. Using a program built for national level with a regional team is possible, but only with a clear view of your squad's real level and by adjusting the loads."],
    },
    why: [
      ["Fitted to age and team", "A U15 does not train like a U18 or a senior: the program follows your team's age group and level."],
      ["Fitted to your calendar", "Restart dates, games, winter break: the training weeks are placed around your sessions."],
      ["The whole program to one address", "The full program is sent to the coach (or the club), to a single email address. You then share with your players whatever you want."],
      ["Almost tailor-made", "Our base plan, adapted to your request: equipment, calendar, priorities. The price is set on quote, depending on the adaptations."],
    ],
    more: {
      h: "Much more than an individual program handed to the whole group",
      p: "The club program is built for the team and taken further towards handball. It is still real physical preparation, with strength and weight training, plus fun, game-like conditioning drills that work in a group.",
      solo: ["Individual program", ["One player, at home or at the gym", "Bodyweight, dumbbells, band", "Everyone at their own pace"]],
      club: ["Club program", ["Sessions built for the whole group: stations, circuits, relays, duels", "Fun, handball-like drills: footwork, changes of direction, contact, shooting at the end of the effort", "With the club's equipment: cones, agility ladders, hurdles, medicine balls, bands", "Ready-to-run organisation: players per station, rotations, work and rest times", "Built around your facilities and equipment, pre-season and in-season"]],
    },
    plan: {
      h: "How a typical session runs",
      p: "Every session follows the same guideline, so the group progresses in the right order. The exercises change over the weeks, the logic stays.",
      steps: [["Movement circuit", "Footwork, coordination, changes of direction, reactivity: the body warms up and trains handball qualities."], ["Strength circuit", "Core, strength work and, depending on age, weight training: the strength that protects and makes you explosive."], ["Running", "Fitness work: intervals, sprints, runs close to match efforts."]],
      custom: "That is our base plan. Then we adapt it to your request: your equipment, facilities, calendar and priorities. It is almost tailor-made, which is why the price is set on quote.",
    },
    how: ["Fill in the form (2 minutes), with your equipment and facilities.", "We talk about your group, level, calendar and equipment.", "You get a quote within 48 hours.", "Once approved, you get the whole program by email, to a single address."],
    howT: "How it works", formT: "Ask for a quote",
    f: { name: "Your name", role: "You are", roles: ["Coach", "Strength and conditioning coach", "Club official", "Other"], club: "Club", email: "Your email", field: "Court players", fieldHint: "Backs, wings, centre backs and pivots", gk: "Goalkeepers", period: "When?", periods: ["Before the season", "During the season", "The whole season"], msg: "Your message (optional)", send: "Send my request", privacy: "This information is only used to reply to you and prepare your quote." },
    ok: "Thank you, your request has been sent! I'll reply within 48 hours by email.", err: "The request could not be sent. Check your email, or write to me directly:",
  },
};

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  const t = text[lang as Lang];
  return { title: t.title, description: t.desc, alternates: { canonical: `/${lang}/clubs`, languages: { fr: "/fr/clubs", en: "/en/clubs" } } };
}

export default async function Clubs({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const t = text[lang as Lang], f = t.f;
  const q = await searchParams;
  const select = (name: string, label: string, opts: string[]) => (
    <label className="cf-field">{label}
      <select name={name} required defaultValue=""><option value="" disabled>—</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
    </label>
  );
  return (
    <div className="pg clubs">
      <p className="clubs-k">{t.k}</p>
      <h1>{t.h1}</h1>
      <p className="lead2">{t.lead}</p>
      <p className="clubs-time"><strong>{t.time[0]}</strong>{t.time[1]}</p>
      <a className="btn clubs-go" href="#devis">{t.formT} →</a>
      <ul className="clubs-why">{t.why.map(([h, p]) => <li key={h}><strong>{h}</strong><span>{p}</span></li>)}</ul>
      <section className="clubs-more">
        <h2>{t.more.h}</h2>
        <p>{t.more.p}</p>
        <div className="clubs-cmp">
          <div className="clubs-solo"><strong>{t.more.solo[0]}</strong><ul>{(t.more.solo[1] as readonly string[]).map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="clubs-club"><strong>{t.more.club[0]}</strong><ul>{(t.more.club[1] as readonly string[]).map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <ClubDrill lang={lang as Lang} />
      </section>
      <section className="clubs-plan">
        <h2>{t.plan.h}</h2>
        <p>{t.plan.p}</p>
        <ol className="plan-steps">{t.plan.steps.map(([h, p], i) => <li key={h}><span className="plan-n">{i + 1}</span><strong>{h}</strong><span>{p}</span></li>)}</ol>
        <p className="plan-custom">{t.plan.custom}</p>
      </section>
      <section className="clubs-care">
        <h2>{t.care.h}</h2>
        <div className="clubs-care-g">
          <div className="care-muscu" role="note"><strong>⚠ {t.care.muscu[0]}</strong><p>{t.care.muscu[1]}</p></div>
          <div className="care-level"><strong>{t.care.level[0]}</strong><p>{t.care.level[1]}</p></div>
          <div className="care-level"><strong>{t.care.base[0]}</strong><p>{t.care.base[1]}</p></div>
          <div className="care-level"><strong>{t.care.coach[0]}</strong><p>{t.care.coach[1]}</p></div>
          <div className="care-level"><strong>{t.care.adapt[0]}</strong><p>{t.care.adapt[1]}</p></div>
        </div>
      </section>
      <h2>{t.howT}</h2>
      <ol className="clubs-how">{t.how.map((s) => <li key={s}>{s}</li>)}</ol>
      <h2 id="devis">{t.formT}</h2>
      {q.envoye ? <p className="clubs-ok" role="status">{t.ok}</p> : (
        <form className="cf" method="post" action="/api/clubs" data-lead="club">
          <input type="hidden" name="lang" value={lang} />
          {q.erreur && <p className="clubs-err" role="alert">{t.err} <strong>{owner.email}</strong></p>}
          <div className="cf-row">
            <label className="cf-field">{f.name}<input name="name" required maxLength={80} autoComplete="name" /></label>
            {select("role", f.role, f.roles)}
          </div>
          <div className="cf-row">
            <label className="cf-field">{f.club}<input name="club" required maxLength={80} autoComplete="organization" /></label>
            <label className="cf-field">{f.email}<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
          </div>
          <ClubTeam lang={lang as Lang} />
          {/* The quote and the documents sent (a follow-up sheet with one line per player, a
              goalkeepers' version) depend on both numbers. */}
          <div className="cf-row">
            <label className="cf-field">{f.field}<span className="cf-hint">{f.fieldHint}</span><input name="field" type="number" inputMode="numeric" min={1} max={60} required /></label>
            <label className="cf-field">{f.gk}<span className="cf-hint">&nbsp;</span><input name="gk" type="number" inputMode="numeric" min={0} max={10} required /></label>
          </div>
          <div className="cf-row">
            {select("period", f.period, f.periods)}
          </div>
          <ClubEquipment lang={lang as Lang} />
          <label className="cf-field">{f.msg}<textarea name="message" rows={4} maxLength={2000} /></label>
          {/* Left empty by people, filled in by spam bots. */}
          <input className="cf-hp" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className="btn" type="submit">{f.send}</button>
          <p className="note">{f.privacy}</p>
        </form>
      )}
    </div>
  );
}
