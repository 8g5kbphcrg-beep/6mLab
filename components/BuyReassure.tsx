import Link from "next/link";
import type { Lang } from "@/lib/dict";
import { REPLY_HOURS } from "@/lib/replies";

// Program pages, large screens: the order form on the right is much longer than the text on the
// left, so this panel fills the left column and stays in view while the form is filled in.
// weeks: the access to the animations, in weeks (null for the Saison complète: the whole season).
export default function BuyReassure({ lang, weeks }: { lang: Lang; weeks: number | null }) {
  const fr = lang === "fr";
  const get = fr
    ? ["Ton programme en PDF, à ton nom : il est à toi pour toujours.", `Une animation pour chaque exercice, dans ton espace client ${weeks ? `pendant ${weeks} semaines` : "pendant toute ta saison"}.`, "Des séances construites pour tes objectifs et ton lieu : maison ou salle."]
    : ["Your program as a PDF, in your name: yours to keep forever.", `An animation for every exercise, in your customer area ${weeks ? `for ${weeks} weeks` : "for your whole season"}.`, "Sessions built for your goals and where you train: home or gym."];
  const trust = fr
    ? ["Paiement sécurisé par Stripe : carte, Apple Pay ou Google Pay.", `Programme envoyé par email, au plus tard sous ${REPLY_HOURS} heures.`]
    : ["Secure payment by Stripe: card, Apple Pay or Google Pay.", `Program sent by email, within ${REPLY_HOURS} hours at most.`];
  return (
    <div className="preass">
      <div className="preass-in">
        <p className="preass-step">{fr ? "Remplis les étapes à droite : objectifs, lieu, options, profil." : "Fill in the steps on the right: goals, place, options, profile."}</p>
        <h2>{fr ? "Ce que tu reçois" : "What you get"}</h2>
        <ul>{get.map((t) => <li key={t}>{t}</li>)}</ul>
        <h2>{fr ? "Commander en confiance" : "Order with confidence"}</h2>
        <ul>{trust.map((t) => <li key={t}>{t}</li>)}</ul>
        <p className="preass-q">{fr ? "Une question avant de commander ?" : "A question before you order?"} <Link href={`/${lang}/contact`}>{fr ? `Écris-nous, réponse sous ${REPLY_HOURS} h` : `Write to us, answer within ${REPLY_HOURS} h`}</Link></p>
      </div>
    </div>
  );
}
