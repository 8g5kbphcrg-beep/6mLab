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
    desc: "Un programme de préparation physique handball pour tout ton groupe, calé sur le calendrier du club. Tarif de groupe, devis sous 48 heures.",
    k: "Clubs et entraîneurs", h1: "Toute ton équipe sur le même programme",
    lead: "Des U15 aux seniors, en filière féminine ou masculine. Pré-saison, maintien en saison ou toute la saison : chaque joueur et chaque joueuse reçoit son programme, et toi, tu gardes la main sur le planning.",
    time: ["Du temps gagné pour toi", "Pas de préparateur physique au club\u00a0? Tu n'as plus à construire les séances de prépa : elles sont écrites, planifiées sur ton calendrier et chaque exercice est animé. Toi, tu gardes ton temps et ton énergie pour le terrain."],
    care: {
      h: "Âge et niveau de jeu : deux repères qui changent tout",
      muscu: ["La musculation chez les jeunes", "Bien menée, la musculation est très bénéfique pour les jeunes, mais elle doit être très bien encadrée. Dans nos programmes club, elle est intégrée à partir des U17 féminines et des U18 masculins. Pour les U15, elle n'est pas recommandée : le travail se fait au poids du corps, avec coordination, gainage, appuis et prévention des blessures."],
      level: ["Le niveau de ton effectif", "Des joueurs de National ont plus d'expérience, plus de physique et une meilleure condition que des joueurs de départemental : le programme est calibré sur le niveau de ton équipe. Utiliser un programme prévu pour le National avec une équipe de région est possible, mais seulement en ayant bien conscience du niveau réel de ton effectif et en adaptant les charges."],
    },
    why: [
      ["Adapté à l'âge et à la filière", "Un U15 ne travaille pas comme un U18 ou un senior : le programme suit la catégorie et le niveau de ton équipe."],
      ["Calé sur ton calendrier", "Dates de reprise, matchs, trêve : on place les semaines de prépa autour de tes entraînements."],
      ["Chaque joueur équipé", "Son PDF à son prénom, et l'accès aux animations de chaque exercice sur son téléphone."],
      ["Tarif de groupe", "Un prix par joueur dégressif selon la taille du groupe, sur devis."],
    ],
    more: {
      h: "Bien plus qu'un programme individuel donné à tout le groupe",
      p: "Le programme club est construit pour le collectif et poussé plus loin vers le handball. On reste sur de la vraie préparation physique, avec du renforcement et de la musculation, mais on y ajoute des situations de prépa ludiques qui ressemblent au jeu et qui fonctionnent en groupe.",
      solo: ["Programme individuel", ["Un joueur seul, à la maison ou en salle", "Poids du corps, haltères, élastique", "Chacun à son rythme"]],
      club: ["Programme club", ["Des séances pensées pour tout le groupe : ateliers, circuits, relais, duels", "Des situations ludiques proches du hand : appuis, changements de direction, contacts, tir en fin d'effort", "Avec le matériel du club : plots, échelles de rythme, haies, médecine-balls, élastiques", "L'organisation prête à l'emploi : nombre de joueurs par atelier, rotations, temps d'effort et de récupération", "Construit avec tes installations et ton matériel, en pré-saison comme en saison"]],
    },
    how: ["Tu remplis le formulaire (2 minutes), avec ton matériel et tes installations.", "On échange sur ton groupe, ton niveau, ton calendrier et ton matériel.", "Tu reçois un devis sous 48 heures.", "Chaque joueur reçoit son programme par email."],
    howT: "Comment ça se passe", formT: "Demander un devis",
    f: { name: "Ton prénom et ton nom", role: "Tu es", roles: ["Entraîneur ou entraîneuse", "Préparateur ou préparatrice physique", "Dirigeant ou dirigeante", "Autre"], club: "Club", email: "Ton email", size: "Nombre de joueurs", sizes: ["Moins de 10", "10 à 15", "16 à 25", "Plus de 25"], period: "Quand ?", periods: ["Avant la saison", "Pendant la saison", "Toute la saison"], msg: "Ton message (facultatif)", send: "Envoyer ma demande", privacy: "Ces informations servent uniquement à te répondre et à préparer ton devis." },
    ok: "Merci, ta demande est bien partie ! Je te réponds sous 48 heures par email.", err: "La demande n'a pas pu partir. Vérifie ton email, ou écris-moi directement :",
  },
  en: {
    title: "Clubs and coaches: physical prep for the whole team | 6M Lab",
    desc: "A handball physical preparation program for your whole squad, fitted to your club's calendar. Group pricing, quote within 48 hours.",
    k: "Clubs and coaches", h1: "Your whole team on the same program",
    lead: "From U15 to seniors, women's or men's teams. Pre-season, in-season or the whole season: every player gets their program, and you stay in charge of the schedule.",
    time: ["Time saved for you", "No strength coach at the club? You no longer have to build the training sessions: they are written out, planned around your calendar, and every exercise is animated. You keep your time and energy for the court."],
    care: {
      h: "Age and level of play: two markers that change everything",
      muscu: ["Weight training for young players", "Done well, weight training is very beneficial for young players, but it must be very well supervised. In our club programs, it starts with U17 girls and U18 boys. For U15s, it is not recommended: the work is done with bodyweight, coordination, core, footwork and injury prevention."],
      level: ["Your squad's level", "National-level players have more experience, more physical strength and better fitness than county-level players: the program is calibrated on your team's level. Using a program built for national level with a regional team is possible, but only with a clear view of your squad's real level and by adjusting the loads."],
    },
    why: [
      ["Fitted to age and team", "A U15 does not train like a U18 or a senior: the program follows your team's age group and level."],
      ["Fitted to your calendar", "Restart dates, games, winter break: the training weeks are placed around your sessions."],
      ["Every player equipped", "Their PDF with their name, and the animation of every exercise on their phone."],
      ["Group pricing", "A price per player that goes down with the size of the group, on quote."],
    ],
    more: {
      h: "Much more than an individual program handed to the whole group",
      p: "The club program is built for the team and taken further towards handball. It is still real physical preparation, with strength and weight training, plus fun, game-like conditioning drills that work in a group.",
      solo: ["Individual program", ["One player, at home or at the gym", "Bodyweight, dumbbells, band", "Everyone at their own pace"]],
      club: ["Club program", ["Sessions built for the whole group: stations, circuits, relays, duels", "Fun, handball-like drills: footwork, changes of direction, contact, shooting at the end of the effort", "With the club's equipment: cones, agility ladders, hurdles, medicine balls, bands", "Ready-to-run organisation: players per station, rotations, work and rest times", "Built around your facilities and equipment, pre-season and in-season"]],
    },
    how: ["Fill in the form (2 minutes), with your equipment and facilities.", "We talk about your group, level, calendar and equipment.", "You get a quote within 48 hours.", "Every player gets their program by email."],
    howT: "How it works", formT: "Ask for a quote",
    f: { name: "Your name", role: "You are", roles: ["Coach", "Strength and conditioning coach", "Club official", "Other"], club: "Club", email: "Your email", size: "Number of players", sizes: ["Fewer than 10", "10 to 15", "16 to 25", "More than 25"], period: "When?", periods: ["Before the season", "During the season", "The whole season"], msg: "Your message (optional)", send: "Send my request", privacy: "This information is only used to reply to you and prepare your quote." },
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
      <section className="clubs-care">
        <h2>{t.care.h}</h2>
        <div className="clubs-care-g">
          <div className="care-muscu" role="note"><strong>⚠ {t.care.muscu[0]}</strong><p>{t.care.muscu[1]}</p></div>
          <div className="care-level"><strong>{t.care.level[0]}</strong><p>{t.care.level[1]}</p></div>
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
          <div className="cf-row">
            {select("size", f.size, f.sizes)}
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
