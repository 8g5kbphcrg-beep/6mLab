import type { Metadata } from "next";
import Link from "next/link";
import "@/app/pages.css";

export const metadata: Metadata = {
  title: "À propos | 6M Lab",
  description: "6M Lab est né de l'expérience d'un joueur de handball, étudiant en STAPS, mention entraînement sportif.",
  alternates: { canonical: "/fr/a-propos" },
};

export default function About() {
  return (
    <div className="pg">
      <h1>À propos de 6M Lab</h1>
      <p className="lead2">Je joue au handball depuis longtemps, et je suis étudiant en STAPS, mention entraînement sportif. 6M Lab est né d'un constat simple : la plupart des joueurs et joueuses amateurs n'ont pas accès à une vraie préparation physique, adaptée à leur sport et à leur emploi du temps.</p>
      <p>J'ai voulu construire ce que j'aurais aimé avoir : des programmes clairs, pensés spécifiquement pour le handball, sans jargon inutile ni matériel compliqué.</p>
      <ul className="avow">
        <li><strong>Le nom</strong><span>« 6M » renvoie à la zone des 6 mètres, la zone de but au handball.</span></li>
        <li><strong>L'approche</strong><span>Des principes d'entraînement solides, appliqués concrètement au handball.</span></li>
        <li><strong>L'objectif</strong><span>Aider les joueurs et joueuses amateurs à progresser et à moins se blesser.</span></li>
      </ul>
      <p>6M Lab démarre tout juste. Les programmes évoluent avec les retours des premières personnes qui les testent.</p>
      <p><Link className="btn" href="/fr/programmes">Voir les programmes</Link></p>
    </div>
  );
}
