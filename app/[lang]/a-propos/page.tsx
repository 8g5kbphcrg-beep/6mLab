import type { Metadata } from "next";
import Link from "next/link";
import "@/app/pages.css";

export const metadata: Metadata = {
  title: "À propos | 6M Lab",
  description: "6M Lab est né de l'expérience de Raphaël : 5 ans en sport-études handball, entraîneur et préparateur physique d'une équipe.",
  alternates: { canonical: "/fr/a-propos" },
};

export default function About() {
  return (
    <div className="pg">
      <h1>À propos de 6M Lab</h1>
      <p className="lead2">Moi, c'est Raphaël. J'ai passé 5 ans en sport-études handball, dans des structures de haut niveau : 5 entraînements par semaine, aux côtés de joueurs de centres de formation, dont certains jouent aujourd'hui en pro.</p>
      <p>J'y ai vu ce que change une vraie préparation physique : des joueurs plus explosifs, plus solides, et moins souvent blessés. En sortant de ces structures, j'ai fait un constat simple : la plupart des joueurs et joueuses amateurs n'y ont pas accès.</p>
      <p>Aujourd'hui, j'entraîne une équipe et j'en ai assuré la préparation physique cet été. Je suis aussi étudiant en STAPS, mention entraînement sportif.</p>
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
