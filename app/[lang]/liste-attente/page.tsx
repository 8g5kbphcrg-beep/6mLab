import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { Lockup } from "@/components/Logo";
import "@/app/pages.css";

// Shown after joining the Fitness & well-being waiting list.
export const metadata: Metadata = { title: "Liste d'attente | 6M Lab", robots: { index: false } };

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ erreur?: string }> };

export default async function ListeAttente({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const { erreur } = await searchParams;
  const fr = (lang as Lang) === "fr";
  return (
    <div className="pg">
      <div className="merci-logo"><Lockup size={80} /></div>
      {!erreur ? (
        <>
          <h1>{fr ? "C'est noté !" : "You're on the list!"}</h1>
          <p>{fr ? "Tu recevras un seul email, le jour du lancement du programme Forme & bien-être." : "You'll get a single email on the day the Fitness & well-being program launches."}</p>
        </>
      ) : (
        <>
          <h1>Oups</h1>
          <p>{erreur === "email"
            ? fr ? "Cette adresse email ne semble pas valide. Vérifie-la et réessaie." : "This email address doesn't look valid. Check it and try again."
            : fr ? "L'inscription n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous." : "Sign-up failed. Try again in a few minutes, or contact us."}</p>
          <p><Link className="btn" href={`/${lang}#forme`}>{fr ? "Réessayer" : "Try again"}</Link></p>
        </>
      )}
      <p><Link href={`/${lang}`}>{fr ? "Retour à l'accueil" : "Back to home"}</Link></p>
    </div>
  );
}
