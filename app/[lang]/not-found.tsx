"use client";
import { usePathname } from "next/navigation";
import "@/app/pages.css";

// Page not found, with the ways back into the site. The language comes from the address (the
// proxy.ts always adds /fr or /en).
const text = {
  fr: {
    k: "Erreur 404", h: "Tir hors cadre : cette page n'existe pas", p: "L'adresse est peut-être mal écrite, ou la page a changé de place. Voici où reprendre.",
    go: [["/fr/questionnaire", "Trouver mon programme", "1 minute de questions, puis le programme qui te correspond."], ["/fr/seance-gratuite", "Recevoir la séance gratuite", "Une vraie séance 6M Lab pour tester, en PDF."], ["/fr/programmes", "Voir les programmes", "Pré-saison, 1re et 2e partie de saison, Saison complète."]],
    more: [["/fr", "Accueil"], ["/fr/faq", "Questions fréquentes"], ["/fr/espace-client", "Espace client"], ["/fr/clubs", "Clubs"], ["/fr/contact", "Contact"]],
  },
  en: {
    k: "Error 404", h: "Shot wide: this page doesn't exist", p: "The address may be mistyped, or the page has moved. Here is where to pick up.",
    go: [["/en/questionnaire", "Find my program", "1 minute of questions, then the program that fits you."], ["/en/seance-gratuite", "Get the free session", "A real 6M Lab session to try, as a PDF."], ["/en/programmes", "See the programs", "Pre-season, first and second half of the season, Full season."]],
    more: [["/en", "Home"], ["/en/faq", "FAQ"], ["/en/espace-client", "Customer area"], ["/en/clubs", "Clubs"], ["/en/contact", "Contact"]],
  },
};

export default function NotFound() {
  const t = text[usePathname()?.startsWith("/en") ? "en" : "fr"];
  return (
    <div className="pg nf">
      <p className="nf-k">{t.k}</p>
      <h1>{t.h}</h1>
      <p className="lead2">{t.p}</p>
      <div className="nf-go">
        {t.go.map(([href, h, d], i) => <a key={href} className={i ? "nf-card" : "nf-card main"} href={href}><strong>{h} →</strong><span>{d}</span></a>)}
      </div>
      <nav className="nf-more" aria-label={t.k}>{t.more.map(([href, l]) => <a key={href} href={href}>{l}</a>)}</nav>
    </div>
  );
}
