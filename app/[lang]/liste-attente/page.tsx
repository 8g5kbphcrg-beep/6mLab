import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { Lockup } from "@/components/Logo";
import "@/app/pages.css";

// Shown after joining a waiting list (Fitness & well-being, football, basketball) or proposing a sport.
export const metadata: Metadata = { title: "Liste d'attente | 6M Lab", robots: { index: false } };

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ erreur?: string; quoi?: string }> };

export default async function ListeAttente({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const { erreur, quoi } = await searchParams;
  const fr = (lang as Lang) === "fr";
  const name = quoi === "foot" ? "Football" : quoi === "basket" ? "Basketball" : fr ? "Forme & bien-être" : "Fitness & well-being";
  return (
    <div className="pg">
      <div className="merci-logo"><Lockup size={80} /></div>
      {!erreur ? (
        <>
          <h1>{quoi === "sport" ? (fr ? "Merci pour ta proposition !" : "Thanks for your suggestion!") : fr ? "C'est noté !" : "You're on the list!"}</h1>
          <p>{quoi === "sport"
            ? fr ? "Les sports les plus demandés seront préparés en priorité. Si tu as laissé ton email, tu seras prévenu(e) le jour du lancement." : "The most requested sports will be prepared first. If you left your email, you'll hear from us on launch day."
            : fr ? `Tu recevras un seul email, le jour du lancement du programme ${name}.` : `You'll get a single email on the day the ${name} program launches.`}</p>
        </>
      ) : (
        <>
          <h1>Oups</h1>
          <p>{erreur === "sport"
            ? fr ? "Écris le nom du sport que tu aimerais voir sur 6M Lab." : "Type the name of the sport you'd like to see on 6M Lab."
            : erreur === "email"
            ? fr ? "Cette adresse email ne semble pas valide. Vérifie-la et réessaie." : "This email address doesn't look valid. Check it and try again."
            : fr ? "L'inscription n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous." : "Sign-up failed. Try again in a few minutes, or contact us."}</p>
          <p><Link className="btn" href={`/${lang}#${quoi === "forme" || !quoi ? "forme" : "formules"}`}>{fr ? "Réessayer" : "Try again"}</Link></p>
        </>
      )}
      <p><Link href={`/${lang}`}>{fr ? "Retour à l'accueil" : "Back to home"}</Link></p>
    </div>
  );
}
