import type { Lang } from "@/lib/dict";
import "@/app/exercice.css";

// Shown instead of an animation (or the library) when it is not open on this device: the
// customer logs in to their customer area (order reference and 6-digit code, lib/client-auth.ts),
// then activates or opens the library of their order, and comes back to this page.
export default function AccessGate({ lang, next }: { lang: Lang; next: string }) {
  const fr = lang === "fr";
  return (
    <div className="exo-back">
      <div className="exo-card acc">
        <p className="acc-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{fr ? "Les animations sont réservées aux clients" : "The animations are for customers"}</h1>
        <p>{fr ? "Connecte-toi à ton espace client avec la référence de ta commande : tu recevras un code à 6 chiffres par email, puis tu ouvriras ta bibliothèque d'exercices." : "Log in to your customer area with your order reference: you will receive a 6-digit code by email, then open your exercise library."}</p>
        <p><a className="btn" href={`/${lang}/espace-client?next=${encodeURIComponent(next)}`}>{fr ? "Me connecter" : "Log in"}</a></p>
        <p className="acc-cta">{fr ? "Pas encore client ?" : "Not a customer yet?"} <a href={`/${lang}/programmes`}>{fr ? "Découvre les programmes" : "See the programs"}</a> · <a href={`/${lang}/handball#seance-gratuite`}>{fr ? "Essaie la séance gratuite" : "Try the free session"}</a></p>
        <p className="acc-cta">{fr ? "Tu as reçu la séance gratuite ?" : "Got the free session?"} <a href={`/${lang}/exercices/seance-gratuite`}>{fr ? "Voir ses animations" : "See its animations"}</a></p>
      </div>
    </div>
  );
}
