import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { Lockup } from "@/components/Logo";
import "@/app/pages.css";

// Shown after the free session form (home page).
export const metadata: Metadata = { title: "Séance gratuite | 6M Lab", robots: { index: false } };

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ erreur?: string }> };

export default async function SeanceGratuite({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const { erreur } = await searchParams;
  const fr = (lang as Lang) === "fr";
  return (
    <div className="pg">
      <div className="merci-logo"><Lockup size={80} /></div>
      {!erreur ? (
        <>
          <h1>{fr ? "C'est envoyé !" : "It's on its way!"}</h1>
          <p>{fr
            ? "Ta séance découverte arrive dans ta boîte mail d'ici quelques minutes. Pense à regarder dans tes spams, et ajoute notre adresse à tes contacts pour recevoir les 3 conseils qui suivent."
            : "Your free session will reach your inbox within a few minutes. Check your spam folder too, and add our address to your contacts to get the 3 tips that follow."}</p>
        </>
      ) : (
        <>
          <h1>{fr ? "Oups" : "Oops"}</h1>
          <p>{erreur === "email"
            ? fr ? "Cette adresse email ne semble pas valide. Vérifie-la et réessaie." : "This email address doesn't look valid. Check it and try again."
            : fr ? "L'envoi n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous." : "Sending failed. Try again in a few minutes, or contact us."}</p>
          <p><Link className="btn" href={`/${lang}#seance-gratuite`}>{fr ? "Réessayer" : "Try again"}</Link></p>
        </>
      )}
      <p>{fr ? "En attendant, découvre les programmes complets :" : "In the meantime, have a look at the full programs:"}</p>
      <p><Link className="btn" href={`/${lang}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</Link></p>
    </div>
  );
}
