import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { faq } from "@/lib/faq";
import "@/app/pages.css";
import "@/app/programme.css";

// General FAQ: what people ask before buying (lib/faq.ts), with FAQPage data for search engines.
type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  const fr = lang === "fr";
  return {
    title: fr ? "Questions fréquentes | 6M Lab" : "FAQ | 6M Lab",
    description: fr ? "Choisir son programme de préparation physique handball, commande, accès aux animations, remboursement, clubs : les réponses aux questions fréquentes." : "Choosing your handball conditioning program, ordering, access to the animations, refunds, clubs: answers to common questions.",
    alternates: { canonical: `/${lang}/faq`, languages: { fr: "/fr/faq", en: "/en/faq" } },
  };
}

// "[text](/path)" in an answer becomes a link.
const rich = (s: string) => s.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
  const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  return m ? <a key={i} href={m[2]}>{m[1]}</a> : part;
});
const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export default async function Faq({ params }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const fr = lang === "fr", groups = faq(lang as Lang);
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: groups.flatMap((g) => g.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } }))) };
  return (
    <div className="pg faqpg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <h1>{fr ? "Questions fréquentes" : "FAQ"}</h1>
      <p className="lead2">{fr ? "Tout ce qu'on demande avant de commencer un programme 6M Lab." : "Everything people ask before starting a 6M Lab program."}</p>
      {groups.map((g) => (
        <section key={g.h}>
          <h2>{g.h}</h2>
          <div className="faq">
            {g.items.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{rich(f.a)}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
