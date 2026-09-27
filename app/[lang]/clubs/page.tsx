import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { owner } from "@/lib/legal";
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
    lead: "Pré-saison, maintien en saison ou toute la saison : chaque joueur et chaque joueuse reçoit son programme, et toi, tu gardes la main sur le planning.",
    why: [
      ["Un programme commun", "Les mêmes objectifs pour tout le groupe, avec une version allégée pour ceux qui débutent."],
      ["Calé sur ton calendrier", "Dates de reprise, matchs, trêve : on place les semaines de prépa autour de tes entraînements."],
      ["Chaque joueur équipé", "Son PDF à son prénom, et l'accès aux animations de chaque exercice sur son téléphone."],
      ["Tarif de groupe", "Un prix par joueur dégressif selon la taille du groupe, sur devis."],
    ],
    how: ["Tu remplis le formulaire (2 minutes).", "On échange sur ton groupe, ton niveau et ton calendrier.", "Tu reçois un devis sous 48 heures.", "Chaque joueur reçoit son programme par email."],
    howT: "Comment ça se passe", formT: "Demander un devis",
    f: { name: "Ton prénom et ton nom", role: "Tu es", roles: ["Entraîneur ou entraîneuse", "Préparateur ou préparatrice physique", "Dirigeant ou dirigeante", "Autre"], club: "Club", email: "Ton email", size: "Nombre de joueurs", sizes: ["Moins de 10", "10 à 15", "16 à 25", "Plus de 25"], level: "Niveau", levels: ["Jeunes", "Départemental ou régional", "National", "Plus haut"], period: "Quand ?", periods: ["Avant la saison", "Pendant la saison", "Toute la saison"], msg: "Ton message (facultatif)", send: "Envoyer ma demande", privacy: "Ces informations servent uniquement à te répondre et à préparer ton devis." },
    ok: "Merci, ta demande est bien partie ! Je te réponds sous 48 heures par email.", err: "La demande n'a pas pu partir. Vérifie ton email, ou écris-moi directement :",
  },
  en: {
    title: "Clubs and coaches: physical prep for the whole team | 6M Lab",
    desc: "A handball physical preparation program for your whole squad, fitted to your club's calendar. Group pricing, quote within 48 hours.",
    k: "Clubs and coaches", h1: "Your whole team on the same program",
    lead: "Pre-season, in-season or the whole season: every player gets their program, and you stay in charge of the schedule.",
    why: [
      ["One shared program", "The same goals for the whole group, with a lighter version for beginners."],
      ["Fitted to your calendar", "Restart dates, games, winter break: the training weeks are placed around your sessions."],
      ["Every player equipped", "Their PDF with their name, and the animation of every exercise on their phone."],
      ["Group pricing", "A price per player that goes down with the size of the group, on quote."],
    ],
    how: ["Fill in the form (2 minutes).", "We talk about your group, level and calendar.", "You get a quote within 48 hours.", "Every player gets their program by email."],
    howT: "How it works", formT: "Ask for a quote",
    f: { name: "Your name", role: "You are", roles: ["Coach", "Strength and conditioning coach", "Club official", "Other"], club: "Club", email: "Your email", size: "Number of players", sizes: ["Fewer than 10", "10 to 15", "16 to 25", "More than 25"], level: "Level", levels: ["Youth", "Regional", "National", "Higher"], period: "When?", periods: ["Before the season", "During the season", "The whole season"], msg: "Your message (optional)", send: "Send my request", privacy: "This information is only used to reply to you and prepare your quote." },
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
      <ul className="clubs-why">{t.why.map(([h, p]) => <li key={h}><strong>{h}</strong><span>{p}</span></li>)}</ul>
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
          <div className="cf-row cf-3">
            {select("size", f.size, f.sizes)}
            {select("level", f.level, f.levels)}
            {select("period", f.period, f.periods)}
          </div>
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
