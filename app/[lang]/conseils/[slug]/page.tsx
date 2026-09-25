import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, readTime, themes, type Post } from "@/lib/posts";
import { SITE } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { recommended } from "@/lib/season";
import { exercices } from "@/programmes/source/exercices.mjs";
import { Anim, cardTitle } from "@/components/BlogBits";
import { FreeSessionForm } from "@/components/HomeSections";
import "@/app/home.css";
import "@/app/blog.css";

type P = { params: Promise<{ lang: string; slug: string }> };

// Rebuilt every hour at most, so the suggested formula follows the calendar.
export const revalidate = 3600;

export const generateStaticParams = () => posts.map((p) => ({ lang: "fr", slug: p.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | 6M Lab`,
    description: post.desc,
    alternates: { canonical: `/fr/conseils/${post.slug}` },
    openGraph: { title: post.title, description: post.desc, type: "article", locale: "fr_FR" },
  };
}

const names = exercices as Record<string, { name: string }>;
const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// The formula that matches the article: Pré-saison for the restart, Maintien for the season,
// otherwise the one that fits the calendar.
const formulaFor = (p: Post): ProgramSlug => (p.theme === "reprise" ? "pre-saison" : p.theme === "saison" ? "maintien-saison" : recommended());

// Two articles to read next: same theme first, then the most recent.
const related = (p: Post) => [...posts.filter((x) => x !== p && x.theme === p.theme), ...[...posts].sort((a, b) => b.date.localeCompare(a.date)).filter((x) => x !== p && x.theme !== p.theme)].slice(0, 2);

export default async function Article({ params }: P) {
  const { lang, slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (lang !== "fr" || !post) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.desc,
    datePublished: post.date,
    inLanguage: "fr",
    publisher: { "@type": "Organization", name: "6M Lab", url: SITE },
    ...(post.source && { citation: post.source.cite }),
  };
  const f = formulaFor(post);
  const prog = programs.fr[f];
  return (
    <article className={`post t-${post.theme}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="pprog" aria-hidden="true" />
      <header className="phero">
        <div className="phero-in">
          <p className="pback2"><Link href="/fr/conseils">← Tous les conseils</Link></p>
          <span className="pc-tags"><b className={`tchip t-${post.theme}`}>{themes[post.theme]}</b>{post.source && <b className="ptype">Étude scientifique</b>}</span>
          <h1>{post.title}</h1>
          <p className="pmeta">
            <time dateTime={post.date}>{fmt(post.date)}</time>
            <span>{readTime(post)} min de lecture</span>
          </p>
        </div>
        <Anim id={post.exos[0]} className="phero-fig" />
      </header>

      <div className="pbody">
        <aside className="pbrief">
          <p className="lab">En bref</p>
          <p>{post.desc}</p>
        </aside>

        {post.body.map((b, i) =>
          "h" in b ? <h2 key={i}>{b.h}</h2> : "ul" in b ? <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul> : <p key={i}>{b.p}</p>,
        )}

        {post.exos.length > 0 && (
          <section className="pexos">
            <h2>Les exercices en mouvement</h2>
            <div className="pexos-g">
              {post.exos.map((id) => (
                <Link key={id} href={`/fr/exercices/${id}`} className="pexo">
                  <Anim id={id} className="pexo-fig" />
                  <span>{names[id]?.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {post.source && (
          <aside className="psource">
            <p className="lab">Source</p>
            <p>{post.source.cite}</p>
            <p className="note">{post.source.access} Ce résumé est rédigé par 6M Lab et ne remplace pas la lecture de l'étude.</p>
            <a href={post.source.url} target="_blank" rel="noopener">Lire l'étude originale ↗</a>
          </aside>
        )}

        <div className="pnext">
          <FreeSessionForm lang="fr" title="Passe à la pratique : ta séance gratuite" />
          <Link href={`/fr/programmes/${f}`} className={`pprogcard ${prog.color}`}>
            <span className="lab">Pour aller plus loin</span>
            <strong>{prog.name}</strong>
            <span>{prog.duration} · {prog.freq}</span>
            <span className="pread">Voir le programme →</span>
          </Link>
        </div>

        <section className="prel">
          <h2>À lire aussi</h2>
          <div className="prel-g">
            {related(post).map((p) => (
              <Link key={p.slug} href={`/fr/conseils/${p.slug}`} className={`prel-c t-${p.theme}`}>
                <Anim id={p.exos[0]} className="prel-fig" />
                <span><b className={`tchip t-${p.theme}`}>{themes[p.theme]}</b><strong>{cardTitle(p)}</strong></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
