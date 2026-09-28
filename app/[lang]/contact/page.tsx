import type { Metadata } from "next";
import { REPLY_HOURS } from "@/lib/replies";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { owner } from "@/lib/legal";
import "@/app/pages.css";

const EMAIL = owner.email;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Contact | 6M Lab" : "Contact | 6M Lab",
    description: lang === "fr" ? "Une question sur les programmes 6M Lab ? Écris-nous." : "A question about 6M Lab programs? Get in touch.",
    alternates: { canonical: `/${lang}/contact` },
  };
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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
      <div className="contactcard">
        <p className="mail">{EMAIL}</p>
        <p>{fr ? `Réponse sous ${REPLY_HOURS} heures. Indique ta référence de commande si tu as commandé : je te réponds plus vite.` : `Reply within ${REPLY_HOURS} hours. Give your order reference if you ordered: I can answer faster.`}</p>
        <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>{fr ? "Envoyer un email" : "Send an email"}</a>
      </div>
    </div>
  );
}
