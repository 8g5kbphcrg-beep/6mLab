import type { Metadata } from "next";
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
  return (
    <div className="pg">
      <h1>Contact</h1>
      <p className="lead2">{fr ? "Une question sur les programmes, sur ton profil, ou autre chose ? Écris-moi directement." : "A question about the programs, your profile, or anything else? Write to me directly."}</p>
      <div className="contactcard">
        <p className="mail">{EMAIL}</p>
        <p>{fr ? "Je réponds en général sous 48 heures." : "I usually reply within 48 hours."}</p>
        <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}>{fr ? "Envoyer un email" : "Send an email"}</a>
      </div>
    </div>
  );
}
