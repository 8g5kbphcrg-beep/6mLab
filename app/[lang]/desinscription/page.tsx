import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import "@/app/pages.css";

// Shown after the unsubscribe link of the free session emails.
export const metadata: Metadata = { title: "Désinscription | 6M Lab", robots: { index: false } };

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ erreur?: string }> };

export default async function Desinscription({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const { erreur } = await searchParams;
  const fr = (lang as Lang) === "fr";
  return (
    <div className="pg">
      <h1>{erreur ? (fr ? "Lien invalide" : "Invalid link") : (fr ? "C'est noté" : "Done")}</h1>
      <p>{erreur
        ? fr ? "Ce lien de désinscription n'est pas valide. Écris-nous et nous te retirons de la liste." : "This unsubscribe link isn't valid. Write to us and we'll remove you from the list."
        : fr ? "Tu ne recevras plus d'emails de conseils de 6M Lab. Bonne préparation !" : "You won't get any more tips emails from 6M Lab. Enjoy your training!"}</p>
      <p><Link href={`/${lang}/contact`}>{fr ? "Nous contacter" : "Contact us"}</Link></p>
    </div>
  );
}
