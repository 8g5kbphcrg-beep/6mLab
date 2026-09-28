import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "@/lib/guides";
import { livePosts, themes } from "@/lib/posts";
import { SITE } from "@/lib/dict";
import { programs } from "@/lib/programs";
import { exercices } from "@/programmes/source/exercices.mjs";
import { Anim, cardTitle } from "@/components/BlogBits";
import { FreeSessionForm } from "@/components/HomeSections";
import "@/app/home.css";
import "@/app/blog.css";
import "@/app/programme.css";

// A guide: the full answer to one important search (lib/guides.ts), in the look of the articles.
type P = { params: Promise<{ lang: string; slug: string }> };

// Rebuilt every hour at most, so the related articles follow the scheduled publications.
export const revalidate = 3600;
export const generateStaticParams = () => guides.map((g) => ({ lang: "fr", slug: g.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  return { title: g.metaTitle, description: g.desc, alternates: { canonical: `/fr/guides/${g.slug}` }, openGraph: { title: g.title, description: g.desc, type: "article", locale: "fr_FR" } };
}

const names = exercices as Record<string, { name: string }>;

export default async function Guide({ params }: P) {
  const { lang, slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (lang !== "fr" || !g) notFound();
  const live = livePosts();
  const articles = g.articles.map((s) => live.find((p) => p.slug === s)).filter((p) => !!p);
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.desc, inLanguage: "fr", publisher: { "@type": "Organization", name: "6M Lab", url: SITE } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const prog = g.next === "clubs" ? null : programs.fr[g.next];
  return (
    <article className={`post t-${g.theme}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="pprog" aria-hidden="true" />
      <header className="phero">
        <div className="phero-in">
          <p className="pback2"><Link href="/fr/conseils">← Conseils et guides</Link></p>
          <span className="pc-tags"><b className="ptype">Guide complet</b><b className={`tchip t-${g.theme}`}>{themes[g.theme]}</b></span>
          <h1>{g.title}</h1>
          <p className="pmeta"><span>{g.desc}</span></p>
        </div>
        <Anim id={g.exos[0]} className="phero-fig" />
      </header>

      <div className="pbody">
        <aside className="pbrief">
          <p className="lab">L'essentiel</p>
          <p>{g.brief}</p>
        </aside>

        {g.body.map((b, i) => ("h" in b ? <h2 key={i}>{b.h}</h2> : "ul" in b ? <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul> : <p key={i}>{b.p}</p>))}

        <section className="pexos">
          <h2>Les exercices en mouvement</h2>
          <div className="pexos-g">
            {g.exos.map((id) => (
              <Link key={id} href={`/fr/exercices/${id}?retour=/fr/guides/${slug}`} className="pexo">
                <Anim id={id} className="pexo-fig" />
                <span>{names[id]?.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Questions fréquentes</h2>
          <div className="faq">
            {g.faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </section>

        <div className="pnext">
          <FreeSessionForm lang="fr" title="Passe à la pratique : ta séance gratuite" />
          {prog ? (
            <Link href={`/fr/programmes/${g.next}`} className={`pprogcard ${prog.color}`}>
              <span className="lab">Pour aller plus loin</span>
              <strong>{prog.name}</strong>
              <span>{prog.duration} · {prog.freq}</span>
              <span className="pread">Voir le programme →</span>
            </Link>
          ) : (
            <Link href="/fr/clubs" className="pprogcard b">
              <span className="lab">Pour toute l'équipe</span>
              <strong>Programme Clubs</strong>
              <span>Gardiens et joueurs de champ, sur le calendrier du club</span>
              <span className="pread">Demander un devis →</span>
            </Link>
          )}
        </div>

        {articles.length > 0 && (
          <section className="prel">
            <h2>Pour approfondir</h2>
            <div className="prel-g">
              {articles.map((p) => (
                <Link key={p.slug} href={`/fr/conseils/${p.slug}`} className={`prel-c t-${p.theme}`}>
                  <Anim id={p.exos[0]} className="prel-fig" />
                  <span><b className={`tchip t-${p.theme}`}>{themes[p.theme]}</b><strong>{cardTitle(p)}</strong></span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
