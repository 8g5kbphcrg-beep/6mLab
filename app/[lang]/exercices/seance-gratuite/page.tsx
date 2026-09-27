import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import { FREE_EXERCISES } from "@/lib/access";
import { exName } from "@/components/ExerciseCard";
import { animatedFigure, variants } from "@/programmes/source/figures.mjs";
import "@/app/library.css";

// The animations of the free session, open to everyone: the 8 exercises, in the session's order,
// each opening its full page. The rest of the library is for customers (lib/access.ts).
export const generateStaticParams = () => locales.map((lang) => ({ lang }));
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const fr = (await params).lang === "fr";
  return {
    title: fr ? "Séance gratuite de prévention handball : les 8 exercices animés | 6M Lab" : "Free handball injury-prevention session: the 8 animated exercises | 6M Lab",
    description: fr ? "15 minutes sans matériel pour protéger chevilles, genoux et épaules : chaque exercice de la séance gratuite 6M Lab en animation." : "15 minutes, no equipment, to protect ankles, knees and shoulders: every exercise of the free 6M Lab session, animated.",
    alternates: { canonical: `/${fr ? "fr" : "en"}/exercices/seance-gratuite` },
  };
}

export default async function FreeAnimations({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  return (
    <div className="lib wrap">
      <p className="lib-k">{fr ? "Séance gratuite" : "Free session"}</p>
      <h1>{fr ? "Les animations de la séance gratuite" : "The free session's animations"}</h1>
      <p className="lib-acc">{fr
        ? "Les 8 exercices de ta séance découverte de 15 minutes, dans l'ordre. Touche un exercice pour le voir en grand, avec ses consignes."
        : "The 8 exercises of your 15-minute free session, in order. Tap an exercise to see it full size, with its instructions."}</p>
      <ul className="free-grid">
        {FREE_EXERCISES.map((id, i) => (
          <li key={id}>
            <Link href={`/${l}/exercices/${id}?retour=/${l}/exercices/seance-gratuite`}>
              <span className="free-fig" aria-hidden="true" dangerouslySetInnerHTML={{ __html: animatedFigure(id, variants(id)[0]) ?? "" }} />
              <span className="free-name"><b>{i + 1}</b> {exName(id, fr ? "fr" : "en")}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="free-more">
        <p><strong>{fr ? "Tu n'as pas encore la séance ?" : "Don't have the session yet?"}</strong> {fr ? "Reçois-la gratuitement par email, avec le PDF." : "Get it free by email, with the PDF."} <Link href={`/${l}/handball#seance-gratuite`}>{fr ? "Recevoir la séance" : "Get the session"}</Link></p>
        <p><strong>{fr ? "Plus de 60 animations" : "60+ animations"}</strong> {fr ? "t'attendent dans les programmes, avec une séance écrite pour chaque jour." : "are waiting in the programs, with a session written for every day."} <Link href={`/${l}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</Link></p>
      </div>
    </div>
  );
}
