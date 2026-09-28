import Nav from "../Nav";
import { isLive, posts, readTime } from "@/lib/posts";

// Read an advice article before it is published (scheduled articles are hidden from the site
// until their date, lib/posts.ts).
export const dynamic = "force-dynamic";

export default async function Apercu({ searchParams }: { searchParams: Promise<{ a?: string }> }) {
  const { a } = await searchParams;
  const p = posts.find((x) => x.slug === a);
  if (!p) return <main><Nav here="accueil" /><h1>Article introuvable</h1><p><a href="/admin">← Retour à l'accueil</a></p></main>;
  const date = new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main>
      <Nav here="accueil" />
      <p className="sub"><a href="/admin">← Accueil</a> · {isLive(p) ? `Publié le ${date}` : `Programmé : se publiera seul le ${date}`} · {readTime(p)} min de lecture</p>
      <h1>{p.title}</h1>
      <p className="muted">{p.desc}</p>
      <div className="card" style={{ maxWidth: 760 }}>
        {p.body.map((b, i) => ("h" in b ? <h2 key={i}>{b.h}</h2> : "p" in b ? <p key={i}>{b.p}</p> : <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>))}
        {p.source && <p className="muted">Source : {p.source.cite} <a href={p.source.url}>Voir l'étude</a></p>}
        <p className="muted">Exercices animés dans l'article : {p.exos.join(", ")}</p>
      </div>
      <p className="muted">Une correction à faire ? Dis-le à Claude avant la date de publication.</p>
    </main>
  );
}
