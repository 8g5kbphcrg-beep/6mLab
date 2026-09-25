import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, readTime, themes, type Post, type Theme } from "@/lib/posts";
import { Anim, cardTitle } from "@/components/BlogBits";
import { FreeSessionForm } from "@/components/HomeSections";
import "@/app/home.css";
import "@/app/blog.css";

export const metadata: Metadata = {
  title: "Conseils de préparation physique handball | 6M Lab",
  description: "Conseils pratiques pour les joueurs et joueuses de handball : reprise, prévention des blessures, entretien de la forme en saison.",
  alternates: { canonical: "/fr/conseils" },
};

// Newest first; the first one is featured. The theme filters are radio buttons read by CSS
// (blog.css), so they work without JavaScript.
const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const filters: [string, string][] = [["tous", "Tous"], ["etudes", "Études"], ...(Object.entries(themes) as [Theme, string][])];

function Card({ p, big = false }: { p: Post; big?: boolean }) {
  return (
    <Link href={`/fr/conseils/${p.slug}`} className={`pc t-${p.theme}${big ? " big" : ""}`} data-t={`${p.theme}${p.source ? " etudes" : ""}`}>
      <Anim id={p.exos[0]} className="pc-fig" />
      <div className="pc-body">
        <span className="pc-tags"><b className={`tchip t-${p.theme}`}>{themes[p.theme]}</b>{p.source && <b className="ptype">Étude</b>}</span>
        {big ? <h2>{cardTitle(p)}</h2> : <h3>{cardTitle(p)}</h3>}
        <p>{p.desc}</p>
        <span className="pread">Lire · {readTime(p)} min →</span>
      </div>
    </Link>
  );
}

export default async function Blog({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return (
    <div className="blog">
      <header className="bhero">
        <div className="wrap">
          <p className="slogan">Le blog 6M Lab</p>
          <h1>Conseils de préparation physique</h1>
          <p>Des conseils simples pour les joueurs et joueuses de handball : reprise, prévention des blessures, forme en pleine saison.</p>
        </div>
      </header>
      <div className="wrap bwrap">
        <div className="bfilters" role="radiogroup" aria-label="Filtrer par thème">
          {filters.map(([id, label], i) => (
            <label key={id} className="bchipf"><input type="radio" name="f" id={`f-${id}`} defaultChecked={i === 0} />{label}</label>
          ))}
        </div>
        <div className="cards">
          {sorted.map((p, i) => <Card key={p.slug} p={p} big={i === 0} />)}
        </div>
        <div className="bfree"><FreeSessionForm lang="fr" title="Passe à la pratique : ta séance gratuite" /></div>
      </div>
    </div>
  );
}
