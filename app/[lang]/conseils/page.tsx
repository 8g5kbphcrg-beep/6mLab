import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/posts";
import "@/app/blog.css";

export const metadata: Metadata = {
  title: "Conseils de préparation physique handball | 6M Lab",
  description: "Conseils pratiques pour les handballeurs : reprise, prévention des blessures, entretien de la forme en saison.",
  alternates: { canonical: "/fr/conseils" },
};

export default async function Blog({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return (
    <div className="post">
      <h1>Conseils de préparation physique</h1>
      <p>Des conseils simples pour les handballeurs : reprise, prévention des blessures, forme en pleine saison.</p>
      <div className="cards">
        {posts.map((p) => (
          <Link key={p.slug} href={`/fr/conseils/${p.slug}`} className="pc">
            <h2>{p.title}</h2>
            <p>{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
