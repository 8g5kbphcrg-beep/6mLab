import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, readTime } from "@/lib/posts";

const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
import "@/app/blog.css";

export const metadata: Metadata = {
  title: "Conseils de préparation physique handball | 6M Lab",
  description: "Conseils pratiques pour les joueurs et joueuses de handball : reprise, prévention des blessures, entretien de la forme en saison.",
  alternates: { canonical: "/fr/conseils" },
};

export default async function Blog({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  const groups: [string, typeof posts][] = [
    ["Ce que dit la science", posts.filter((p) => p.source)],
    ["Conseils pratiques", posts.filter((p) => !p.source)],
  ];
  return (
    <div className="blog">
      <header className="shead page">
        <h1>Conseils de préparation physique</h1>
        <p>Des conseils simples pour les joueurs et joueuses de handball : reprise, prévention des blessures, forme en pleine saison.</p>
      </header>
      {groups.map(([title, list]) => (
        <section key={title} className="bgroup">
          <h2>{title}</h2>
          <div className="cards">
            {list.map((p) => (
              <Link key={p.slug} href={`/fr/conseils/${p.slug}`} className={p.source ? "pc study" : "pc"}>
                <span className="pdate">{p.source && <b className="ptype">Étude scientifique</b>}{fmt(p.date)} · {readTime(p)} min de lecture</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="pread">Lire l'article →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
