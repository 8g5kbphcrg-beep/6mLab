import type { Metadata } from "next";
import { REPLY_HOURS, TOPICS } from "@/lib/replies";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { owner } from "@/lib/legal";
import "@/app/pages.css";
import "@/app/clubs.css";

const EMAIL = owner.email;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Contact | 6M Lab" : "Contact | 6M Lab",
    description: lang === "fr" ? "Une question sur les programmes 6M Lab ? Écris-nous." : "A question about 6M Lab programs? Get in touch.",
    alternates: { canonical: `/${lang}/contact` },
  };
}

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ envoye?: string; erreur?: string }> };

export default async function Contact({ params, searchParams }: P) {
  const { lang } = await params;
  const q = await searchParams;
  if (!(lang in dict)) notFound();
  const fr = lang === "fr";
  const subject = fr ? "Question sur 6M Lab" : "Question about 6M Lab";
  // The email opens pre-filled: the order reference saves a round trip.
  const body = fr ? "Bonjour,\n\nRéférence de commande (si tu as commandé) : \n\nMa question : \n" : "Hi,\n\nOrder reference (if you ordered): \n\nMy question: \n";
  // The most frequent questions answer themselves, before writing.
  const quick: [string, string][] = fr
    ? [["Ouvrir mes animations, mon parrainage, mes points", "/fr/espace-client"], ["Choisir mon programme (1 minute)", "/fr/questionnaire"], ["Commande, accès, remboursement : les questions fréquentes", "/fr/faq"], ["Un programme pour mon équipe", "/fr/clubs"]]
    : [["Open my animations, referral, points", "/en/espace-client"], ["Choose my program (1 minute)", "/en/questionnaire"], ["Order, access, refund: frequent questions", "/en/faq"], ["A program for my team", "/en/clubs"]];
  return (
    <div className="pg">
      <h1>Contact</h1>
      <p className="lead2">{fr ? "Une question sur les programmes, sur ton profil, ou autre chose ? Écris-moi directement." : "A question about the programs, your profile, or anything else? Write to me directly."}</p>
      <div className="contactquick">
        <p className="contactquick-t">{fr ? "Ta réponse est peut-être déjà ici" : "Your answer may already be here"}</p>
        <ul>{quick.map(([t, href]) => <li key={href}><a href={href}>{t} →</a></li>)}</ul>
      </div>
      {/* The form (app/api/contact): the message reaches 6M Lab and the customer gets an
          acknowledgement at once. The address stays below for those who prefer their own mailbox. */}
      <h2 id="ecrire">{fr ? "Écris-moi" : "Write to me"}</h2>
      {q.envoye ? (
        <p className="clubs-ok" role="status">{fr ? `Merci, ton message est bien parti ! Un accusé de réception vient de t'être envoyé par email (regarde dans tes indésirables s'il n'arrive pas), et je te réponds sous ${REPLY_HOURS} heures.` : `Thank you, your message has been sent! An acknowledgement has just been emailed to you (check your spam folder if it doesn't arrive), and I'll reply within ${REPLY_HOURS} hours.`}</p>
      ) : (
        <form className="cf" method="post" action="/api/contact">
          <input type="hidden" name="lang" value={lang} />
          {q.erreur && <p className="clubs-err" role="alert">{q.erreur === "trop" ? (fr ? "Trop de messages envoyés depuis cette connexion. Réessaie dans une heure, ou écris-moi directement :" : "Too many messages from this connection. Try again in an hour, or write to me directly:") : (fr ? "Le message n'a pas pu partir. Vérifie ton email, ou écris-moi directement :" : "The message could not be sent. Check your email, or write to me directly:")} <strong>{EMAIL}</strong></p>}
          <div className="cf-row">
            <label className="cf-field">{fr ? "Ton email" : "Your email"}<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
            <label className="cf-field">{fr ? "Sujet" : "Topic"}<select name="topic" required defaultValue="">{[<option key="" value="" disabled>—</option>, ...TOPICS[fr ? "fr" : "en"].map((t) => <option key={t}>{t}</option>)]}</select></label>
          </div>
          <label className="cf-field">{fr ? "Référence de commande (si tu as commandé)" : "Order reference (if you ordered)"}<span className="cf-hint">{fr ? "Dans l'email de confirmation : je te réponds plus vite." : "In the confirmation email: I can answer faster."}</span><input name="ref" maxLength={40} autoComplete="off" spellCheck={false} /></label>
          <label className="cf-field">{fr ? "Ton message" : "Your message"}<textarea name="message" rows={6} required minLength={5} maxLength={4000} /></label>
          <input className="cf-hp" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <p className="cf-hint">{fr ? `Réponse sous ${REPLY_HOURS} heures, avec un accusé de réception tout de suite. Ton adresse sert seulement à te répondre.` : `Reply within ${REPLY_HOURS} hours, with an acknowledgement straight away. Your address is only used to reply to you.`}</p>
          <button className="btn" type="submit">{fr ? "Envoyer" : "Send"}</button>
        </form>
      )}
      <div className="contactcard">
        <p>{fr ? "Tu préfères ta messagerie ? Écris directement à :" : "Prefer your own mailbox? Write directly to:"}</p>
        <p className="mail">{EMAIL}</p>
        <a className="btn btn-ghost" href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>{fr ? "Ouvrir ma messagerie" : "Open my mailbox"}</a>
      </div>
    </div>
  );
}
