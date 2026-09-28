import type { Lang } from "@/lib/dict";
import "@/app/exercice.css";

// Shown instead of an animation (or the library) when it is not open on this device: the
// customer logs in to their customer area (order reference and 6-digit code, lib/client-auth.ts),
// then activates or opens the library of their order, and comes back to this page. A club player
// enters the code of their team instead (lib/club-access.ts).
export default function AccessGate({ lang, next, state }: { lang: Lang; next: string; state?: string }) {
  const fr = lang === "fr";
  const errors: Record<string, [string, string]> = {
    "club-inconnu": ["Ce code club n'existe pas. Vérifie-le auprès de ton coach (format CLUB-XXXX-XXXX).", "This club code does not exist. Check it with your coach (format CLUB-XXXX-XXXX)."],
    "club-fini": ["Ce code club n'est plus valable : la saison prévue est terminée. Parles-en à ton coach.", "This club code is no longer valid: its season has ended. Talk to your coach."],
    "club-plein": ["Ce code club est déjà utilisé sur le nombre maximum d'appareils. Ton coach peut demander à libérer des places.", "This club code is already used on the maximum number of devices. Your coach can ask to free some."],
    trop: ["Trop d'essais. Réessaie dans une heure.", "Too many tries. Try again in an hour."],
    indisponible: ["La vérification n'a pas fonctionné. Réessaie dans quelques minutes.", "The check did not work. Try again in a few minutes."],
  };
  return (
    <div className="exo-back">
      <div className="exo-card acc">
        <p className="acc-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{fr ? "Les animations sont réservées aux clients" : "The animations are for customers"}</h1>
        <p>{fr ? "Connecte-toi à ton espace client avec la référence de ta commande : tu recevras un code à 6 chiffres par email, puis tu ouvriras ta bibliothèque d'exercices." : "Log in to your customer area with your order reference: you will receive a 6-digit code by email, then open your exercise library."}</p>
        {state && errors[state] && <p className="acc-err" role="alert">{errors[state][fr ? 0 : 1]}</p>}
        <p><a className="btn" href={`/${lang}/espace-client?next=${encodeURIComponent(next)}`}>{fr ? "Me connecter" : "Log in"}</a></p>
        <div className="acc-club">
          <p><strong>{fr ? "Tu t'entraînes avec ton club ?" : "Training with your club?"}</strong> {fr ? "Entre le code donné par ton coach." : "Enter the code your coach gave you."}</p>
          <form method="post" action="/api/acces-club" className="acc-form">
            <input type="hidden" name="next" value={next} />
            <label className="sr" htmlFor="acc-club">{fr ? "Code club" : "Club code"}</label>
            <input id="acc-club" name="code" required autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="CLUB-XXXX-XXXX" maxLength={20} />
            <button className="btn" type="submit">{fr ? "Ouvrir les animations" : "Open the animations"}</button>
          </form>
        </div>
        <p className="acc-cta">{fr ? "Pas encore client ?" : "Not a customer yet?"} <a href={`/${lang}/programmes`}>{fr ? "Découvre les programmes" : "See the programs"}</a> · <a href={`/${lang}/handball#seance-gratuite`}>{fr ? "Essaie la séance gratuite" : "Try the free session"}</a></p>
        <p className="acc-cta">{fr ? "Tu as reçu la séance gratuite ?" : "Got the free session?"} <a href={`/${lang}/exercices/seance-gratuite`}>{fr ? "Voir ses animations" : "See its animations"}</a></p>
      </div>
    </div>
  );
}
