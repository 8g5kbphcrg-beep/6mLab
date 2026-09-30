import { accessWeeks, MAX_DEVICES } from "@/lib/access";
import { SITE } from "@/lib/dict";
import { CODE_MINUTES } from "@/lib/client-auth";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, SPONSOR_PERCENT, VALIDATION_DAYS } from "@/lib/referral";
import { PROMO_PERCENT } from "@/lib/feedback";

// Ready-made answers to the questions customers ask most (admin, Réponses types): copied, then
// adapted in the reply. Figures come from the code, so they stay true when a rule changes.
// [crochets] = to replace before sending.
export const REPLY_HOURS = 48;
// The topics of the Contact page form (app/api/contact): they head the email 6M Lab receives.
export const TOPICS = {
  fr: ["Ma commande ou mon accès", "Choisir un programme", "Un programme pour mon équipe", "Autre question"],
  en: ["My order or my access", "Choosing a program", "A program for my team", "Other question"],
} as const;

export type Reply = { id: string; t: string; when: string; fr: string; en: string };

const sign = { fr: "Bonne séance,\nRaphaël, 6M Lab", en: "Enjoy your training,\nRaphaël, 6M Lab" };
const w = (o: "pre-saison" | "maintien-saison" | "pack") => accessWeeks(o);

export const REPLIES: Reply[] = [
  {
    id: "code", t: "Je ne reçois pas mon code de connexion", when: "Espace client, code à 6 chiffres. Regarde d'abord le journal « Connexions » sur l'accueil de l'admin.",
    fr: `Bonjour [Prénom],\n\nLe code est envoyé à l'adresse email de ta commande, quelques secondes après avoir entré ta référence (ligne « Référence » de ton email de confirmation, 12 caractères). Il est valable ${CODE_MINUTES} minutes.\n\n- Regarde dans tes indésirables.\n- Si tu as payé avec Apple Pay, Apple a peut-être masqué ton adresse : le code arrive quand même dans ta boîte habituelle, mais parfois avec quelques minutes de retard.\n- Sur la page du code, le bouton « Renvoyer le code » en envoie un nouveau.\n\nSi rien n'arrive, réponds-moi avec ta référence de commande et je regarde tout de suite.\n\n${sign.fr}`,
    en: `Hi [Name],\n\nThe code is sent to the email address of your order, a few seconds after you enter your reference (the “Reference” line of your confirmation email, 12 characters). It is valid for ${CODE_MINUTES} minutes.\n\n- Check your spam folder.\n- If you paid with Apple Pay, Apple may have hidden your address: the code still reaches your usual inbox, sometimes a few minutes late.\n- On the code page, the “Resend the code” button sends a new one.\n\nIf nothing arrives, reply with your order reference and I'll look right away.\n\n${sign.en}`,
  },
  {
    id: "programme", t: "Je n'ai pas reçu mon programme", when: "Commande payée, PDF pas arrivé. Vérifie dans Commandes & avis ; si besoin, envoie les PDF depuis Programmes.",
    fr: `Bonjour [Prénom],\n\nMerci pour ta commande. Je viens de vérifier : [ton programme t'a été envoyé le ... à l'adresse ... / je te l'envoie en pièce jointe de cet email].\n\nPense à regarder dans tes indésirables. Tes animations s'ouvrent depuis ton espace client (${SITE}/fr/espace-client) avec ta référence de commande.\n\n${sign.fr}`,
    en: `Hi [Name],\n\nThank you for your order. I just checked: [your program was sent on ... to ... / I'm attaching it to this email].\n\nRemember to check your spam folder. Your animations open from your customer area (${SITE}/en/espace-client) with your order reference.\n\n${sign.en}`,
  },
  {
    id: "appareils", t: "Les animations ne s'ouvrent plus (appareils)", when: `Plus de ${MAX_DEVICES} appareils. Libère-les dans Commandes & avis (bouton « Libérer »), puis réponds.`,
    fr: `Bonjour [Prénom],\n\nTon accès aux animations fonctionne sur ${MAX_DEVICES} appareils au plus, et ils étaient tous utilisés. Je viens de les libérer : reconnecte-toi à ton espace client (${SITE}/fr/espace-client) depuis l'appareil que tu veux utiliser, puis « Accéder à ma bibliothèque ».\n\n${sign.fr}`,
    en: `Hi [Name],\n\nYour access to the animations works on ${MAX_DEVICES} devices at most, and they were all in use. I just freed them: log back in to your customer area (${SITE}/en/espace-client) from the device you want to use, then “Open my library”.\n\n${sign.en}`,
  },
  {
    id: "fin-acces", t: "Mon accès aux animations est terminé", when: "Accès expiré. Le PDF reste au client ; tu peux proposer la suite.",
    fr: `Bonjour [Prénom],\n\nTon accès aux animations couvrait la durée de ton programme plus 2 semaines (${w("pre-saison")} semaines pour la Pré-saison, ${w("maintien-saison")} pour le Maintien, ${w("pack")} pour le Pack) : il s'est terminé le [date]. Ton PDF, lui, reste à toi et tu peux continuer à t'en servir.\n\nPour la suite de ta saison, [le Maintien en saison / un nouveau cycle / la Pré-saison] te redonne l'accès aux animations pendant tout le programme : ${SITE}/fr/programmes\n\n${sign.fr}`,
    en: `Hi [Name],\n\nYour access to the animations covered your program plus 2 weeks (${w("pre-saison")} weeks for the Pre-season, ${w("maintien-saison")} for the Maintenance, ${w("pack")} for the Pack): it ended on [date]. Your PDF is yours to keep and you can go on using it.\n\nFor the rest of your season, [the In-season maintenance / a new cycle / the Pre-season] gives you the animations again for the whole program: ${SITE}/en/programmes\n\n${sign.en}`,
  },
  {
    id: "rembourser", t: "Je veux être remboursé", when: "Avant l'envoi du programme : rembourser dans Stripe. Après : seulement si le contenu pose problème (CGV).",
    fr: `Bonjour [Prénom],\n\n[Avant l'envoi] Ton programme n'avait pas encore été envoyé : je viens de lancer le remboursement, il apparaîtra sur ton compte sous 5 à 10 jours.\n\n[Après l'envoi] Comme indiqué dans les conditions de vente (${SITE}/fr/cgv), un programme numérique déjà envoyé n'est plus remboursable, sauf s'il pose problème. Dis-moi ce qui ne va pas (fichier, animations, contenu) : je corrige tout de suite, et si je n'y arrive pas, je te rembourse.\n\n${sign.fr}`,
    en: `Hi [Name],\n\n[Before sending] Your program had not been sent yet: I just started the refund, it will show on your account within 5 to 10 days.\n\n[After sending] As stated in the terms of sale (${SITE}/en/terms), a digital program that has been sent can no longer be refunded, unless it has a problem. Tell me what is wrong (file, animations, content): I'll fix it right away, and if I can't, I'll refund you.\n\n${sign.en}`,
  },
  {
    id: "choisir", t: "Quel programme choisir ?", when: "Avant l'achat.",
    fr: `Bonjour [Prénom],\n\nMerci pour ton message. Pour choisir :\n- avant la reprise (été), la Pré-saison : 8 semaines, 3 à 4 séances par semaine ;\n- pendant la saison, le Maintien : 12 semaines, 2 séances courtes par semaine, placées loin des matchs ;\n- pour toute l'année, le Pack Saison complète.\n\nLe questionnaire (1 minute) te recommande le bon programme et les bons objectifs : ${SITE}/fr/questionnaire\n\nDis-moi ton âge, ton poste et ce que tu veux améliorer si tu veux un avis plus précis.\n\n${sign.fr}`,
    en: `Hi [Name],\n\nThanks for your message. To choose:\n- before the restart (summer), the Pre-season: 8 weeks, 3 to 4 sessions a week;\n- during the season, the Maintenance: 12 weeks, 2 short sessions a week, placed away from games;\n- for the whole year, the Full season pack.\n\nThe questionnaire (1 minute) recommends the right program and goals: ${SITE}/en/questionnaire\n\nTell me your age, position and what you want to improve if you'd like more precise advice.\n\n${sign.en}`,
  },
  {
    id: "blessure", t: "J'ai une douleur ou une blessure", when: "Ne jamais donner d'avis médical.",
    fr: `Bonjour [Prénom],\n\nMerci de m'en parler. Avant de continuer, fais voir cette douleur par un médecin ou un kiné : je ne peux pas juger une blessure à distance, et aucun programme ne doit se faire sur une douleur.\n\nQuand tu as leur feu vert, reprends en choisissant la version plus facile de chaque exercice. Le programme Réathlétisation, pensé pour le retour après blessure, est en préparation.\n\nPrends soin de toi,\nRaphaël, 6M Lab`,
    en: `Hi [Name],\n\nThanks for telling me. Before going on, have this pain checked by a doctor or a physio: I can't assess an injury remotely, and no program should be done through pain.\n\nOnce they give you the green light, start again with the easier version of each exercise. The Return-to-play program, designed for coming back after an injury, is in preparation.\n\nTake care,\nRaphaël, 6M Lab`,
  },
  {
    id: "mineur", t: "Je suis mineur, je peux commander ?", when: "Avant l'achat.",
    fr: `Bonjour [Prénom],\n\nOui, avec l'accord d'un parent ou d'un représentant légal, qui peut aussi passer la commande pour toi. Le programme tient compte de ton âge : avant U17 (filles) et U18 (garçons), le renforcement se fait au poids du corps, sans charges.\n\n${sign.fr}`,
    en: `Hi [Name],\n\nYes, with the agreement of a parent or legal guardian, who can also place the order for you. The program takes your age into account: before U17 (girls) and U18 (boys), strength work is done with bodyweight only, no loads.\n\n${sign.en}`,
  },
  {
    id: "promo", t: "Mon code promo ou de parrainage ne marche pas", when: "Vérifier le code dans Stripe (Catalogue de produits > Coupons).",
    fr: `Bonjour [Prénom],\n\nLe code se saisit sur la page de paiement, dans le champ « Ajouter un code promotionnel ». Un seul code par commande. Le code de parrainage d'un coéquipier donne -${FRIEND_PERCENT} % ; le code reçu après l'avis (-${PROMO_PERCENT} %) et celui du parrainage (-${SPONSOR_PERCENT} %, à ${POINTS_FOR_REWARD} points) servent une fois et sont valables un an.\n\nJe viens de vérifier ton code [CODE] : [il est actif, réessaie en le copiant sans espace / il avait déjà servi / il a expiré, je t'en envoie un nouveau : ...].\n\n${sign.fr}`,
    en: `Hi [Name],\n\nThe code is entered on the payment page, in the “Add promotion code” field. One code per order. A teammate's referral code gives ${FRIEND_PERCENT}% off; the code received after your feedback (${PROMO_PERCENT}%) and the referral one (${SPONSOR_PERCENT}%, at ${POINTS_FOR_REWARD} points) work once and are valid for one year.\n\nI just checked your code [CODE]: [it is active, try again by copying it without spaces / it had already been used / it expired, here is a new one: ...].\n\n${sign.en}`,
  },
  {
    id: "points", t: "Mes points de parrainage n'apparaissent pas", when: "Regarder dans Commandes & avis le statut du filleul (en attente, doublon, remboursé).",
    fr: `Bonjour [Prénom],\n\nChaque coéquipier qui commande avec ton code te rapporte ${POINTS_PER_FRIEND} points, validés ${VALIDATION_DAYS} jours après sa commande (le temps d'un éventuel remboursement). Chaque personne ne compte qu'une fois, avec sa propre adresse email et son propre moyen de paiement.\n\nPour ta commande, [ton coéquipier est en attente : ses points arrivent le ... / cette commande a été faite avec une adresse ou une carte déjà comptée, elle ne donne pas de points].\n\n${sign.fr}`,
    en: `Hi [Name],\n\nEvery teammate who orders with your code earns you ${POINTS_PER_FRIEND} points, confirmed ${VALIDATION_DAYS} days after their order (in case of a refund). Each person counts only once, with their own email address and payment method.\n\nFor your order, [your teammate is pending: the points arrive on ... / this order was made with an address or card already counted, it gives no points].\n\n${sign.en}`,
  },
  {
    id: "club", t: "Demande de devis club : accusé de réception", when: `Dès réception, si le devis complet demande plus de ${REPLY_HOURS} h.`,
    fr: `Bonjour [Prénom],\n\nMerci pour votre demande pour [club, catégorie]. Je l'ai bien reçue et je vous envoie le devis et une proposition de programme sous ${REPLY_HOURS} heures.\n\nPour être au plus juste : [question sur le calendrier / le matériel / le nombre de séances par semaine].\n\nSportivement,\nRaphaël, 6M Lab`,
    en: `Hi [Name],\n\nThank you for your request for [club, category]. I've received it and will send you the quote and a program proposal within ${REPLY_HOURS} hours.\n\nTo be as accurate as possible: [question about the calendar / equipment / number of sessions a week].\n\nBest regards,\nRaphaël, 6M Lab`,
  },
  {
    id: "facture", t: "J'ai besoin d'une facture", when: "Stripe > Paiements > la commande > « Envoyer le reçu » ou télécharger la facture.",
    fr: `Bonjour [Prénom],\n\nVoici la facture de ta commande du [date] en pièce jointe [ou : je viens de te la renvoyer depuis notre système de paiement, elle arrive dans quelques minutes].\n\n${sign.fr}`,
    en: `Hi [Name],\n\nPlease find the invoice for your order of [date] attached [or: I just sent it again from our payment system, it arrives in a few minutes].\n\n${sign.en}`,
  },
];
