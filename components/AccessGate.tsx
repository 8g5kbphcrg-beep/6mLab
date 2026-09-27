import type { Lang } from "@/lib/dict";
import { accessWeeks, MAX_DEVICES, type Offer } from "@/lib/access";
import GoBack from "@/components/GoBack";
import "@/app/exercice.css";

// Shown instead of an animation (or the library) until the customer opens the access with the
// reference of their order: the form, the confirmation before the very first opening (the
// countdown cannot be paused), and the reasons it did not open.
const OFFERS: Record<Offer, [string, string]> = { "pre-saison": ["Pré-saison", "Pre-season"], "maintien-saison": ["Maintien en saison", "In-season maintenance"], pack: ["Pack Saison complète", "Full season pack"] };
const fmt = (ms: number, lang: Lang) => new Date(ms).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

export default function AccessGate({ lang, next, state, code: givenRef, offer }: { lang: Lang; next: string; state?: string; code?: string; offer?: string }) {
  const fr = lang === "fr";
  const o = (["pre-saison", "maintien-saison", "pack"] as Offer[]).find((x) => x === offer);
  const errors: Record<string, [string, string]> = {
    inconnue: ["Cette référence ne correspond à aucune commande payée. Vérifie-la dans ton email de confirmation (ligne « Référence », 12 caractères).", "This reference does not match any paid order. Check it in your confirmation email (the “Reference” line, 12 characters)."],
    remboursee: ["Cette commande a été remboursée : l'accès aux animations n'est plus disponible.", "This order was refunded: access to the animations is no longer available."],
    "trop-tard": ["L'accès de cette commande devait être ouvert dans les 12 mois suivant l'achat. Écris-nous si besoin.", "This order's access had to be opened within 12 months of the purchase. Write to us if needed."],
    expiree: ["Ton accès aux animations est terminé : il couvrait la durée de ton programme, plus 2 semaines. Ton PDF reste à toi. Pour ta prochaine saison, découvre les programmes.", "Your access to the animations has ended: it covered your program, plus 2 weeks. Your PDF is yours to keep. For your next season, see the programs."],
    appareils: [`Cette référence est déjà utilisée sur ${MAX_DEVICES} appareils. Écris-nous pour libérer une place (par exemple si tu as changé de téléphone).`, `This reference is already used on ${MAX_DEVICES} devices. Write to us to free a spot (for example if you changed phones).`],
    trop: ["Trop d'essais. Réessaie dans une heure.", "Too many tries. Try again in an hour."],
    indisponible: ["La vérification n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous.", "The check did not work. Try again in a few minutes, or write to us."],
  };
  const confirm = state === "a-confirmer" && givenRef && o;
  const now = Date.now(), end = o ? now + accessWeeks(o) * 7 * 86400000 : 0;
  return (
    <div className="exo-back">
      <div className="exo-card acc">
        {confirm ? (
          <>
            <p className="acc-k">{fr ? "Espace clients" : "Customer area"}</p>
            <h1>{fr ? "Prêt à lancer ton accès aux animations ?" : "Ready to start your access to the animations?"}</h1>
            <p className="acc-dates">
              {fr ? `${OFFERS[o][0]} : ton accès sera ouvert ${accessWeeks(o)} semaines, ` : `${OFFERS[o][1]}: your access will be open for ${accessWeeks(o)} weeks, `}
              <strong>{fr ? `du ${fmt(now, lang)} au ${fmt(end, lang)}` : `from ${fmt(now, lang)} to ${fmt(end, lang)}`}</strong>.
            </p>
            <p>{fr ? "Le compte à rebours démarre dès maintenant et ne peut pas être mis en pause. Si tu ne commences pas ton programme aujourd'hui, reviens le jour où tu démarres." : "The countdown starts now and cannot be paused. If you are not starting your program today, come back on the day you start."}</p>
            <form method="post" action="/api/acces" className="acc-go">
              <input type="hidden" name="ref" value={givenRef} />
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="confirm" value="1" />
              <button className="btn" type="submit">{fr ? "Lancer mon accès maintenant" : "Start my access now"}</button>
              <GoBack home={`/${lang}`} label={fr ? "Pas encore : je reviendrai quand je commence" : "Not yet: I'll come back when I start"} />
            </form>
          </>
        ) : (
          <>
            <p className="acc-k">{fr ? "Espace clients" : "Customer area"}</p>
            <h1>{fr ? "Les animations sont réservées aux clients" : "The animations are for customers"}</h1>
            {state && errors[state] && <p className="acc-err" role="alert">{errors[state][fr ? 0 : 1]}</p>}
            <p>{fr ? "Entre la référence de ta commande : elle est dans ton email de confirmation, ligne « Référence »." : "Enter your order reference: it is in your confirmation email, on the “Reference” line."}</p>
            <form method="post" action="/api/acces" className="acc-form">
              <input type="hidden" name="next" value={next} />
              <label className="sr" htmlFor="acc-ref">{fr ? "Référence de commande" : "Order reference"}</label>
              <input id="acc-ref" name="ref" required autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={fr ? "Ex. : a1B2c3D4e5F6" : "E.g. a1B2c3D4e5F6"} maxLength={40} />
              <button className="btn" type="submit">{fr ? "Ouvrir mes animations" : "Open my animations"}</button>
            </form>
            <ul className="acc-rules">
              <li>{fr ? "Ton accès démarre la première fois que tu l'ouvres (on te demandera de confirmer) : ouvre-le le jour où tu commences ton programme." : "Your access starts the first time you open it (you will be asked to confirm): open it on the day you start your program."}</li>
              <li>{fr ? "Il dure la durée de ton programme + 2 semaines : Pré-saison 10 semaines, Maintien en saison 14 semaines, Pack Saison complète 22 semaines." : "It lasts your program + 2 weeks: Pre-season 10 weeks, In-season maintenance 14 weeks, Full season pack 22 weeks."}</li>
              <li>{fr ? `À ouvrir dans les 12 mois après l'achat, sur ${MAX_DEVICES} appareils au plus.` : `To be opened within 12 months of the purchase, on ${MAX_DEVICES} devices at most.`}</li>
            </ul>
            <p className="acc-cta">{fr ? "Pas encore client ?" : "Not a customer yet?"} <a href={`/${lang}/programmes`}>{fr ? "Découvre les programmes" : "See the programs"}</a> · <a href={`/${lang}/handball#seance-gratuite`}>{fr ? "Essaie la séance gratuite" : "Try the free session"}</a></p>
          </>
        )}
      </div>
    </div>
  );
}
