import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import { animatedIds, exerciseList } from "@/components/ExerciseCard";
import AccessGate from "@/components/AccessGate";
import LibrarySearch from "@/components/LibrarySearch";
import { accessEnd, type Gate } from "@/lib/access-page";
import "@/app/library.css";

// Customer area: every animated exercise, by family. For customers only, while their access
// lasts (lib/access.ts); each exercise opens its page with every version (home, gym, band).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bibliothèque d'exercices | 6M Lab", robots: { index: false } };

const FAMILIES: [string, string, string[]][] = [
  ["Échauffement et mobilité", "Warm-up and mobility", ["footing-dynamique", "montees-genoux", "fente-rotation", "ouverture-hanche", "hanches-9090", "cheville-mur", "rotation-thoracique"]],
  ["Sauts et explosivité", "Jumps and power", ["saut-reception", "reception-unipodale", "snap-down", "pogos", "squat-jump", "squat-jump-leste", "skater-hop", "bonds", "box-jump", "drop-jump"]],
  ["Vitesse et appuis", "Speed and footwork", ["accelerations", "departs-10", "departs-reactifs", "sprint-20", "freinage", "navette-5105"]],
  ["Force", "Strength", ["squat", "squat-lourd", "fente-arriere", "squat-bulgare", "squat-une-jambe", "sdt-roumain", "hip-thrust", "hip-thrust-lourd", "pompes", "pompes-explosives", "developpe-couche", "developpe-militaire", "rowing", "tirage-lourd", "tractions", "fermier"]],
  ["Lancers", "Throws", ["lancer-poitrine", "lancer-rotation", "lancer-haut"]],
  ["Gainage", "Core", ["planche", "gainage-lateral", "dead-bug", "pallof", "copenhague"]],
  ["Prévention des blessures", "Injury prevention", ["pont-fessier", "pont-une-jambe", "equilibre", "equilibre-balle", "nordic", "mollets-excentrique", "ytw", "rotation-externe", "rotation-externe-haute", "pompes-scapulaires"]],
  ["Condition physique", "Conditioning", ["footing", "intervalles-1515", "intervalles-3030", "sprints-repetes", "navettes-hand", "circuit"]],
];

type P = { params: Promise<{ lang: string }>; searchParams: Promise<Gate> };

export default async function Library({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  const end = await accessEnd();
  if (!end) {
    const g = await searchParams;
    return <AccessGate lang={l} next={`/${l}/exercices`} state={g.acces} code={g.ref} offer={g.offre} />;
  }
  const days = Math.ceil((end - Date.now()) / 86400000);
  const listed = new Set(FAMILIES.flatMap((f) => f[2]));
  const families = [...FAMILIES, ["Autres", "Others", animatedIds.filter((id) => !listed.has(id))] as [string, string, string[]]]
    .map(([a, b, ids]) => [fr ? a : b, ids.filter((id) => animatedIds.includes(id))] as const)
    .filter(([, ids]) => ids.length);
  return (
    <div className="lib wrap">
      <p className="lib-k">{fr ? "Espace client" : "Customer area"}</p>
      <h1>{fr ? "Bibliothèque d'exercices" : "Exercise library"}</h1>
      <p className="lib-acc">
        {fr ? "Ton accès est ouvert jusqu'au " : "Your access is open until "}
        <strong>{new Date(end).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" })}</strong>
        {fr ? ` (encore ${days} jour${days > 1 ? "s" : ""}).` : ` (${days} day${days > 1 ? "s" : ""} left).`}
      </p>
      <LibrarySearch fr={fr} items={families.flatMap(([, ids]) => ids.map((id) => [id, exerciseList[id].name] as [string, string]))} />
      {families.map(([name, ids]) => (
        <section key={name}>
          <h2>{name}</h2>
          <ul className="lib-grid">
            {ids.map((id) => (
              <li key={id} id={`ex-${id}`}><Link href={`/${l}/exercices/${id}?retour=/${l}/exercices`}>{exerciseList[id].name}<span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
