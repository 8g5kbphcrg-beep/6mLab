import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, readTime } from "@/lib/posts";
import { SITE } from "@/lib/dict";
import "@/app/blog.css";

type P = { params: Promise<{ lang: string; slug: string }> };

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
  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="pmeta"><Link href="/fr/conseils">← Tous les conseils</Link></p>
      <h1>{post.title}</h1>
      <p className="pmeta">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
        <span>{readTime(post)} min de lecture</span>
      </p>
      {post.body.map((b, i) =>
        "h" in b ? <h2 key={i}>{b.h}</h2> : "ul" in b ? <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul> : <p key={i}>{b.p}</p>,
      )}
      {post.source && (
        <aside className="psource">
          <p className="lab">Source</p>
          <p>{post.source.cite}</p>
          <p className="note">{post.source.access} Ce résumé est rédigé par 6M Lab et ne remplace pas la lecture de l'étude.</p>
          <a href={post.source.url} target="_blank" rel="noopener">Lire l'étude originale ↗</a>
        </aside>
      )}
      <div className="postcta">
        <p><strong>Envie de passer à la pratique ?</strong> Réponds à quelques questions, on te recommande la formule adaptée.</p>
        <Link className="btn" href="/fr/questionnaire">Trouver mon programme</Link>
      </div>
    </article>
  );
}
