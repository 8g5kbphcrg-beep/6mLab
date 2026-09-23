import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { dict, type Lang } from "@/lib/dict";
import "@/app/pages.css";

export const metadata: Metadata = { title: "Merci | 6M Lab", robots: { index: false } };

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ session_id?: string }> };

export default async function Merci({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const fr = (lang as Lang) === "fr";
  const { session_id } = await searchParams;

  let email: string | null | undefined;
  let paid = false;
  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const s = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(session_id);
      paid = s.payment_status === "paid";
      email = s.customer_details?.email;
    } catch {}
  }

  return (
    <div className="pg">
      <h1>{fr ? "Merci !" : "Thank you!"}</h1>
      {paid ? (
        <p>{fr
          ? <>Ton paiement est bien reçu. Tu recevras ton programme sous 48 heures à l'adresse <strong>{email}</strong>, avec la confirmation de ta commande.</>
          : <>Your payment has been received. You will get your program within 48 hours at <strong>{email}</strong>, along with your order confirmation.</>}</p>
      ) : (
        <p>{fr
          ? "Nous n'avons pas pu confirmer ton paiement sur cette page. Si tu as été débité, pas d'inquiétude : écris-nous et nous vérifions ta commande."
          : "We couldn't confirm your payment on this page. If you were charged, don't worry: contact us and we'll check your order."}</p>
      )}
      <p>{fr ? "Une question d'ici là ?" : "Any question in the meantime?"} <Link href={`/${lang}/contact`}>{fr ? "Contacte-nous" : "Contact us"}</Link>.</p>
      <p><Link className="btn" href={fr ? "/fr/conseils" : `/${lang}`}>{fr ? "Lire nos conseils" : "Back to home"}</Link></p>
    </div>
  );
}
