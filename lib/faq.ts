import type { Lang } from "@/lib/dict";
import { fmtPrice, PACK_PRICE, prices, RUNNING_PRICE, SECOND_GOAL_PRICE } from "@/lib/checkout";
import { accessWeeks, ACTIVATE_WITHIN_DAYS, MAX_DEVICES } from "@/lib/access";
import { owner } from "@/lib/legal";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, SPONSOR_PERCENT, VALIDATION_DAYS } from "@/lib/referral";

// General FAQ (app/[lang]/faq): the questions asked before buying, grouped by theme. Prices,
// access lengths and device limits come from the code that applies them, so the answers stay true.
// "a" may hold links written as [text](/path).
export type Faq = { h: string; items: { q: string; a: string }[] }[];

export function faq(lang: Lang): Faq {
  const p = (c: number) => fmtPrice(c, lang);
  const pre = p(prices["pre-saison"]), main = p(prices["maintien-saison"]), pack = p(PACK_PRICE);
  const [wPre, wMain, wPack] = [accessWeeks("pre-saison"), accessWeeks("maintien-saison"), accessWeeks("pack")];
  const months = Math.round(ACTIVATE_WITHIN_DAYS / 30.4);
  if (lang === "fr") return [
    { h: "Choisir son programme", items: [
      { q: "Quel programme choisir ?", a: `Pré-saison (${pre}) : 8 semaines, 3 à 4 séances par semaine, à faire pendant les 2 mois avant la reprise. Maintien en saison (${main}) : 12 semaines, 2 séances courtes par semaine, placées loin des matchs. Saison complète (${pack}) : les deux à la suite, soit 20 semaines. Tu hésites ? Le [questionnaire](/fr/questionnaire) te recommande le bon programme en une minute.` },
      { q: "Comment fonctionnent les objectifs ?", a: `Tu choisis 1 objectif inclus parmi Développement musculaire, Explosivité, Puissance, Condition physique et Prévention & santé. Tu peux en ajouter un 2e pour ${p(SECOND_GOAL_PRICE)}. La Réathlétisation (retour après blessure) est en préparation.` },
      { q: "Je débute en préparation physique, c'est pour moi ?", a: "Oui. Chaque séance indique une version plus facile, et les premières semaines servent à apprendre les gestes avec un effort modéré." },
      { q: "À la maison ou en salle ?", a: "Tu choisis à la commande. Maison : poids du corps et objets du quotidien, avec des variantes à l'élastique. Salle : haltères, barre et poulies. Le programme est construit pour le lieu choisi." },
      { q: "Les programmes sont-ils les mêmes pour les filles et les garçons ?", a: "Le contenu est adapté à tes objectifs, pas à ton genre. Les silhouettes des animations suivent le genre que tu indiques, ou restent neutres si tu préfères ne pas le dire." },
      { q: "Il y a une partie course à pied ?", a: `Oui, en option à ${p(RUNNING_PRICE)} : un programme de course calé sur tes semaines.` },
      { q: "Je suis blessé ou j'ai une douleur, je peux commencer ?", a: "Demande d'abord l'avis d'un médecin ou d'un kiné. Aucun programme n'est recommandé en cas de blessure. Une fois le feu vert obtenu, le programme Réathlétisation sera fait pour ça : il est en préparation." },
      { q: "Il y a un plan alimentaire ?", a: "Non, les programmes portent sur l'entraînement uniquement." },
    ] },
    { h: "Commande et accès", items: [
      { q: "Comment je reçois mon programme ?", a: "Par email, en PDF à ton nom. Les animations des exercices s'ouvrent depuis ton [espace client](/fr/espace-client) : tu te connectes avec ta référence de commande et un code à 6 chiffres reçu par email." },
      { q: "Je garde le PDF ?", a: "Oui, pour toujours. Seul l'accès en ligne aux animations est limité dans le temps." },
      { q: "Combien de temps ai-je accès aux animations ?", a: `Le temps du programme plus 2 semaines : ${wPre} semaines pour Pré-saison, ${wMain} pour Maintien, ${wPack} pour Saison complète. L'accès démarre quand tu actives ta bibliothèque dans ton espace client, pas le jour de l'achat : tu as ${months} mois pour le lancer. Il fonctionne sur ${MAX_DEVICES} appareils au plus.` },
      { q: "Je peux avoir mon programme en anglais ?", a: "Oui : à la commande, tu choisis la langue du programme (français ou anglais)." },
      { q: "Comment se passe le paiement ?", a: "Le paiement est sécurisé par Stripe : carte bancaire, et Apple Pay ou Google Pay selon ton appareil. 6M Lab ne voit jamais tes informations de carte." },
      { q: "Je suis mineur, je peux commander ?", a: "Oui, avec l'accord d'un parent ou d'un représentant légal, qui peut aussi passer la commande pour toi." },
      { q: "Comment marche le parrainage ?", a: `Après ta commande, tu reçois ton code de parrainage (dans l'email de confirmation et dans ton [espace client](/fr/espace-client), avec tes points). Donne-le à tes coéquipiers : ils ont -${FRIEND_PERCENT} % sur leur programme en le saisissant sur la page de paiement. Chaque coéquipier qui commande avec te rapporte ${POINTS_PER_FRIEND} points, validés ${VALIDATION_DAYS} jours après sa commande. À ${POINTS_FOR_REWARD} points, tu reçois par email un code de -${SPONSOR_PERCENT} % sur ton prochain programme, valable un an. Chaque coéquipier compte une fois : il faut des personnes différentes, avec leur propre adresse email et leur propre moyen de paiement.` },
      { q: "Je peux être remboursé ?", a: "Tant que le programme ne t'a pas été envoyé, tu peux te rétracter et être remboursé. Une fois envoyé, le contenu numérique n'est plus remboursable, sauf s'il pose problème (fichier illisible, animation inaccessible) : il est alors corrigé, ou remboursé. Le détail est dans les [CGV](/fr/cgv)." },
    ] },
    { h: "Clubs et entraîneurs", items: [
      { q: "Vous faites des programmes pour toute une équipe ?", a: "Oui, à partir des U15 : un programme pour le groupe, calé sur le calendrier du club, le matériel et les installations. Le prix est établi sur devis, sous 48 heures. Tout est sur la [page Clubs](/fr/clubs)." },
      { q: "Mon équipe doit-elle avoir un niveau minimum ?", a: "Chaque catégorie et chaque niveau suppose des acquis physiques. Ils s'affichent dans le formulaire de devis dès que tu choisis le niveau." },
      { q: "Mon coach m'a donné un code club, où je le mets ?", a: "Le code ressemble à CLUB-XXXX-XXXX et il est écrit sur les documents de ton équipe. Saisis-le sur la [page Clubs](/fr/clubs#code) ou dans l'[espace client](/fr/espace-client), sans créer de compte. Il ouvre la bibliothèque clubs sur ton appareil jusqu'à la fin de la saison prévue par ton club. Le nombre d'appareils est limité (l'effectif et le staff) : si le code est « complet », préviens ton coach." },
    ] },
    { h: "Autres questions", items: [
      { q: "Je n'ai pas trouvé ma réponse", a: `Écris à ${owner.email} ou passe par la [page Contact](/fr/contact). Réponse en général sous 48 heures.` },
    ] },
  ];
  return [
    { h: "Choosing a program", items: [
      { q: "Which program should I choose?", a: `Pre-season (${pre}): 8 weeks, 3 to 4 sessions a week, for the 2 months before your club restarts. In-season maintenance (${main}): 12 weeks, 2 short sessions a week, placed away from games. Full season (${pack}): both back to back, 20 weeks. Not sure? The [questionnaire](/en/questionnaire) recommends the right program in a minute.` },
      { q: "How do the goals work?", a: `You pick 1 included goal among Muscle development, Explosiveness, Power, Fitness and Prevention & health. You can add a 2nd one for ${p(SECOND_GOAL_PRICE)}. Return to play after injury is coming soon.` },
      { q: "I'm new to physical training, is it for me?", a: "Yes. Every session has an easier version, and the first weeks are for learning the movements at a moderate effort." },
      { q: "At home or at the gym?", a: "You choose when ordering. Home: bodyweight and everyday objects, with resistance band variations. Gym: dumbbells, barbell and cables. The program is built for the place you choose." },
      { q: "Are the programs the same for girls and boys?", a: "The content follows your goals, not your gender. The figures in the animations follow the gender you give, or stay neutral if you prefer not to say." },
      { q: "Is there a running part?", a: `Yes, as an option for ${p(RUNNING_PRICE)}: a running program that fits your weeks.` },
      { q: "I'm injured or in pain, can I start?", a: "Ask a doctor or physio first. No program is recommended while injured. Once you are cleared, the Return to play program will be made for that: it is coming soon." },
      { q: "Is there a meal plan?", a: "No, the programs cover training only." },
    ] },
    { h: "Order and access", items: [
      { q: "How do I get my program?", a: "By email, as a PDF with your name. The exercise animations open from your [customer area](/en/espace-client): you log in with your order reference and a 6-digit code received by email." },
      { q: "Do I keep the PDF?", a: "Yes, forever. Only the online access to the animations is time-limited." },
      { q: "How long can I watch the animations?", a: `The length of the program plus 2 weeks: ${wPre} weeks for Pre-season, ${wMain} for Maintenance, ${wPack} for Full season. Access starts when you activate your library in your customer area, not on the day you buy: you have ${months} months to start it. It works on ${MAX_DEVICES} devices at most.` },
      { q: "Can I get my program in French?", a: "Yes: when ordering, you choose the language of the program (English or French)." },
      { q: "How does payment work?", a: "Payment is secured by Stripe: card, and Apple Pay or Google Pay depending on your device. 6M Lab never sees your card details." },
      { q: "I'm under 18, can I order?", a: "Yes, with the agreement of a parent or legal guardian, who can also place the order for you." },
      { q: "How does the referral work?", a: `After your order, you get your referral code (in the confirmation email and in your [customer area](/en/espace-client), with your points). Give it to your teammates: they get ${FRIEND_PERCENT}% off their program by entering it on the payment page. Every teammate who orders with it earns you ${POINTS_PER_FRIEND} points, confirmed ${VALIDATION_DAYS} days after their order. At ${POINTS_FOR_REWARD} points, you get a ${SPONSOR_PERCENT}% discount code for your next program by email, valid for one year. Each teammate counts once: they must be different people, with their own email address and their own payment method.` },
      { q: "Can I get a refund?", a: "Until the program has been sent to you, you can withdraw and get a refund. Once sent, digital content can no longer be refunded, unless it has a problem (unreadable file, animation not available): it is then fixed, or refunded. Details are in the [terms of sale](/en/terms)." },
    ] },
    { h: "Clubs and coaches", items: [
      { q: "Do you make programs for a whole team?", a: "Yes, from U15: one program for the group, fitted to the club's calendar, equipment and facilities. The price is set on quote, within 48 hours. Everything is on the [Clubs page](/en/clubs)." },
      { q: "Does my team need a minimum level?", a: "Each age group and level assumes some physical prerequisites. They show up in the quote form as soon as you choose the level." },
      { q: "My coach gave me a club code, where do I enter it?", a: "The code looks like CLUB-XXXX-XXXX and is written on your team's documents. Enter it on the [Clubs page](/en/clubs#code) or in the [customer area](/en/espace-client), with no account needed. It opens the club library on your device until the end date set by your club. The number of devices is limited (squad and staff): if the code is \"full\", tell your coach." },
    ] },
    { h: "Other questions", items: [
      { q: "I didn't find my answer", a: `Write to ${owner.email} or use the [Contact page](/en/contact). Replies usually within 48 hours.` },
    ] },
  ];
}
