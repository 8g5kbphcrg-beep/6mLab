import type { Lang } from "@/lib/dict";

// Fill these in once the micro-entreprise is registered. Anything in [brackets] is shown
// highlighted on the site as "to complete".
export const owner = {
  name: "[Prénom Nom]",
  siret: "[SIRET]",
  address: "[Adresse postale]",
  email: "sixmlab.contact@icloud.com",
  mediator: "[Nom et site web du médiateur de la consommation]",
};

export const updated = { fr: "25 septembre 2026", en: "25 September 2026" };

export type LegalDoc = "notice" | "privacy" | "cgv";

export const legalPaths: Record<Lang, Record<LegalDoc, string>> = {
  fr: { notice: "/fr/mentions-legales", privacy: "/fr/confidentialite", cgv: "/fr/cgv" },
  en: { notice: "/en/legal-notice", privacy: "/en/privacy", cgv: "/en/terms" },
};

// A body item is a paragraph, or a bullet list when it is an array.
type Section = { h: string; body: (string | string[])[] };
type Doc = { title: string; desc: string; intro?: string; sections: Section[] };

const o = owner;
const host = "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com)";
const hostEn = "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA (vercel.com)";

export const legal: Record<Lang, Record<LegalDoc, Doc>> = {
  fr: {
    notice: {
      title: "Mentions légales",
      desc: "Mentions légales du site 6M Lab : éditeur, hébergeur et propriété intellectuelle.",
      sections: [
        { h: "Éditeur du site", body: [
          `Le site 6M Lab est édité par ${o.name}, entrepreneur individuel (micro-entreprise).`,
          [`Adresse : ${o.address}`, `SIRET : ${o.siret}`, "TVA non applicable, article 293 B du Code général des impôts", `Email : ${o.email}`],
        ] },
        { h: "Directeur de la publication", body: [o.name] },
        { h: "Hébergement", body: [`Le site est hébergé par ${host}.`] },
        { h: "Propriété intellectuelle", body: [
          "Les textes, illustrations, logos, programmes et animations présents sur ce site sont la propriété de 6M Lab, sauf mention contraire. Toute reproduction ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.",
        ] },
        { h: "Données personnelles", body: ["Le traitement de tes données est décrit dans la politique de confidentialité."] },
        { h: "Santé", body: [
          "Les contenus du site et des programmes sont destinés à des personnes en bonne santé. Ils ne remplacent pas l'avis d'un médecin ou d'un professionnel de santé.",
        ] },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      desc: "Quelles données 6M Lab collecte, pourquoi, combien de temps, et comment exercer tes droits.",
      intro: "6M Lab collecte le moins de données possible. Cette page explique lesquelles, pourquoi, et comment exercer tes droits.",
      sections: [
        { h: "Responsable du traitement", body: [`${o.name}, éditeur de 6M Lab. Contact : ${o.email}.`] },
        { h: "Données collectées et pourquoi", body: [[
          "Lors d'un achat : ton nom, ton adresse email, ton pays, le programme, les objectifs et les options choisis, ainsi que ton prénom, ton âge et ton genre (tu peux choisir de ne pas le préciser). Ces données servent à traiter ta commande, adapter et t'envoyer ton programme, et tenir la comptabilité (base légale : exécution du contrat et obligations comptables). Les données de carte bancaire sont saisies directement chez Stripe : 6M Lab n'y a jamais accès.",
          "Quand tu nous écris par email : ton adresse et le contenu de ton message, pour te répondre (base légale : intérêt légitime).",
          "Après un achat, nous t'envoyons deux questionnaires facultatifs (2 semaines après l'achat et à la fin du programme). Tes réponses servent à améliorer les programmes (base légale : intérêt légitime). Ton témoignage et ta note ne sont publiés sur le site qu'avec ton accord, avec ton seul prénom (base légale : consentement, que tu peux retirer à tout moment en nous écrivant).",
          "Séance gratuite : ton adresse email et ta langue, pour t'envoyer la séance puis 3 emails de conseils de préparation, espacés sur une dizaine de jours (base légale : consentement, en demandant la séance). Chaque email contient un lien de désinscription en un clic.",
          "Liste d'attente du programme Forme & bien-être : ton adresse email et ta langue, pour t'envoyer un seul email le jour du lancement (base légale : consentement). Tu peux te désinscrire à tout moment.",
          "Questionnaire Forme & bien-être : ton prénom, ton âge, tes choix (objectif, niveau, lieu, temps disponible) et, uniquement si tu coches la case prévue, ta silhouette, tes douleurs, ta taille et ton poids. Ces informations servent seulement à préparer ton programme (base légale : consentement explicite). Elles ne sont jamais publiées ni transmises à d'autres fins, et tu peux demander leur suppression à tout moment.",
          "Le questionnaire : tes réponses restent dans ton navigateur. Elles ne sont ni envoyées ni enregistrées.",
          "Données techniques : l'hébergeur enregistre des journaux (adresse IP, pages consultées) nécessaires au fonctionnement et à la sécurité du site (base légale : intérêt légitime).",
        ]] },
        { h: "Cookies", body: [
          "Le site n'utilise aucun cookie de mesure d'audience ou de publicité. La page de paiement Stripe peut déposer des cookies strictement nécessaires à la sécurité du paiement et à la lutte contre la fraude, qui ne nécessitent pas ton consentement.",
        ] },
        { h: "Destinataires", body: [
          "Tes données ne sont jamais vendues. Elles sont transmises uniquement aux prestataires nécessaires au service :",
          ["Stripe (paiement)", "Vercel (hébergement du site)", "Apple (messagerie iCloud, pour les emails)"],
          "Certains de ces prestataires peuvent traiter des données hors de l'Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par le Data Privacy Framework UE–États-Unis ou par les clauses contractuelles types de la Commission européenne.",
        ] },
        { h: "Durée de conservation", body: [[
          "Commandes et factures : 10 ans, durée imposée par les obligations comptables.",
          "Échanges par email : 3 ans après notre dernier échange.",
          "Réponses aux questionnaires : 3 ans. Avis publiés : jusqu'à ce que tu demandes leur retrait.",
          "Séance gratuite : ton adresse email est conservée 3 ans après ta demande, ou jusqu'à ta désinscription si tu veux qu'elle soit effacée plus tôt (écris-nous).",
          "Journaux techniques : durée limitée fixée par l'hébergeur.",
        ]] },
        { h: "Tes droits", body: [
          `Tu peux demander l'accès à tes données, leur rectification, leur effacement, leur portabilité, la limitation du traitement ou t'y opposer, en écrivant à ${o.email}. Nous répondons sous un mois.`,
          "Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL (cnil.fr).",
        ] },
      ],
    },
    cgv: {
      title: "Conditions générales de vente",
      desc: "Conditions générales de vente des programmes de préparation physique 6M Lab.",
      sections: [
        { h: "1. Objet", body: [
          `Les présentes conditions régissent la vente en ligne des programmes 6M Lab à des consommateurs. Le vendeur est ${o.name}, entrepreneur individuel (micro-entreprise), ${o.address}, SIRET ${o.siret}, joignable à ${o.email}.`,
          "Toute commande implique l'acceptation de ces conditions, qui peuvent être modifiées à tout moment. Les conditions applicables sont celles en vigueur au jour de la commande.",
        ] },
        { h: "2. Les programmes", body: [
          "Les programmes sont des contenus numériques : un document PDF présentant le planning complet semaine par semaine, et des animations montrant chaque exercice, accessibles en ligne. Lors de la commande, l'acheteur choisit un objectif parmi ceux proposés, ou le programme Réathlétisation seul. Il peut ajouter un deuxième objectif, vendu 5 € en plus du programme. Il peut ajouter l'option course à pied, un programme complémentaire de séances de course de 30 à 45 minutes, vendue 9 € en plus du programme. Le contenu et la durée de chaque programme sont décrits sur sa page.",
          "Les programmes portent sur l'entraînement uniquement. Ils ne comprennent ni plan alimentaire ni suivi individuel.",
          "Ils sont destinés à des personnes en bonne santé. En cas de blessure, de douleur ou de doute sur ton état de santé, demande l'avis d'un médecin avant de commencer. L'acheteur reste responsable de l'adaptation de l'effort à sa condition physique et du respect des consignes.",
        ] },
        { h: "3. Prix", body: [
          "Les prix sont indiqués en euros, toutes taxes comprises. TVA non applicable, article 293 B du Code général des impôts. Le prix facturé est celui affiché au moment de la commande.",
        ] },
        { h: "4. Commande", body: [
          "Pour commander, l'acheteur choisit un programme, ses objectifs et, s'il le souhaite, l'option course à pied, accepte les présentes conditions, demande l'exécution immédiate du contrat et renonce à son droit de rétractation dans les conditions de l'article 7, puis procède au paiement.",
          "Si l'acheteur est mineur, la commande doit être passée avec l'accord d'un parent ou d'un représentant légal. Le contrat est conclu dès la confirmation du paiement. Une confirmation de commande est envoyée par email, reprenant les caractéristiques du programme, son prix, les présentes conditions et l'accord de l'acheteur mentionné ci-dessus.",
        ] },
        { h: "5. Paiement", body: [
          "Le paiement s'effectue par carte bancaire via le prestataire sécurisé Stripe. Le montant est débité au moment de la commande. 6M Lab n'a jamais accès aux données bancaires de l'acheteur.",
        ] },
        { h: "6. Livraison", body: [
          "Le programme est envoyé par email à l'adresse indiquée lors du paiement, dans un délai de 48 heures. Si tu ne l'as pas reçu passé ce délai, vérifie tes courriers indésirables puis écris-nous.",
        ] },
        { h: "7. Droit de rétractation", body: [
          "Conformément à l'article L221-28, 13° du Code de la consommation, le droit de rétractation ne peut pas être exercé pour un contenu numérique fourni sans support matériel dont l'exécution a commencé avec l'accord préalable et exprès du consommateur, qui a renoncé à son droit de rétractation.",
          `En cochant la case prévue lors de la commande, l'acheteur donne cet accord. L'exécution commence à l'envoi du programme. Tant que le programme n'a pas été envoyé, l'acheteur peut se rétracter en écrivant à ${o.email}, par exemple à l'aide du modèle ci-dessous. Il est alors remboursé sous 14 jours, par le même moyen de paiement.`,
          `Modèle de formulaire de rétractation : « À l'attention de ${o.name}, 6M Lab, ${o.address}, ${o.email}. Je notifie par la présente ma rétractation du contrat portant sur le programme ci-dessous : [programme], commandé le [date]. Nom : [nom]. Adresse email utilisée pour la commande : [email]. Date : [date]. »`,
        ] },
        { h: "8. Garantie de conformité", body: [
          "Le vendeur répond des défauts de conformité du contenu numérique dans les conditions des articles L224-25-12 et suivants du Code de la consommation. En cas de problème (fichier illisible, animation inaccessible), écris-nous : le programme sera mis en conformité, ou à défaut le prix sera réduit ou remboursé.",
        ] },
        { h: "9. Utilisation des programmes", body: [
          "L'achat donne droit à un usage personnel et non transférable du programme. Il est interdit de le revendre, de le partager ou de le diffuser, en tout ou en partie, sans autorisation écrite.",
        ] },
        { h: "10. Responsabilité", body: [
          "6M Lab ne saurait être tenu responsable d'un dommage résultant d'une mauvaise exécution des exercices, du non-respect des consignes ou de la pratique malgré une contre-indication médicale.",
        ] },
        { h: "11. Données personnelles", body: ["Les données collectées lors de la commande sont traitées comme décrit dans la politique de confidentialité."] },
        { h: "12. Réclamations et médiation", body: [
          `Pour toute réclamation, écris d'abord à ${o.email}. En l'absence de solution, tu peux recourir gratuitement au médiateur de la consommation : ${o.mediator}.`,
        ] },
        { h: "13. Avis clients", body: [
          "Après son achat, l'acheteur reçoit par email deux questionnaires facultatifs, 2 semaines après l'achat et à la fin du programme. Les avis publiés sur le site proviennent uniquement de ces questionnaires, donc d'acheteurs vérifiés. Pour avoir répondu au questionnaire final, l'acheteur reçoit un code de réduction de 15 % sur un prochain programme, quel que soit le contenu de son avis.",
          "Les avis ne sont pas modifiés. Seuls sont publiés ceux dont l'auteur a accepté la publication, avec son prénom et la date de l'avis. La note moyenne affichée tient compte de toutes les réponses au questionnaire final, y compris les avis non publiés. L'auteur peut demander le retrait de son avis à tout moment.",
        ] },
        { h: "14. Droit applicable", body: [
          "Les présentes conditions sont soumises au droit français. En cas de litige, le consommateur peut saisir la juridiction de son lieu de domicile ou toute autre juridiction compétente.",
        ] },
      ],
    },
  },
  en: {
    notice: {
      title: "Legal notice",
      desc: "Legal notice for the 6M Lab website: publisher, host and intellectual property.",
      sections: [
        { h: "Publisher", body: [
          `The 6M Lab website is published by ${o.name}, sole trader (French micro-entreprise).`,
          [`Address: ${o.address}`, `SIRET: ${o.siret}`, "VAT not applicable, article 293 B of the French General Tax Code", `Email: ${o.email}`],
        ] },
        { h: "Publication director", body: [o.name] },
        { h: "Hosting", body: [`The website is hosted by ${hostEn}.`] },
        { h: "Intellectual property", body: [
          "The texts, illustrations, logos, programs and animations on this website belong to 6M Lab unless stated otherwise. Any reproduction or distribution, in whole or in part, without prior written permission is prohibited.",
        ] },
        { h: "Personal data", body: ["How your data is handled is described in the privacy policy."] },
        { h: "Health", body: [
          "The content of this website and of the programs is intended for healthy people. It does not replace the advice of a doctor or health professional.",
        ] },
      ],
    },
    privacy: {
      title: "Privacy policy",
      desc: "What data 6M Lab collects, why, for how long, and how to exercise your rights.",
      intro: "6M Lab collects as little data as possible. This page explains which data, why, and how to exercise your rights.",
      sections: [
        { h: "Data controller", body: [`${o.name}, publisher of 6M Lab. Contact: ${o.email}.`] },
        { h: "Data collected and why", body: [[
          "When you buy: your name, email address, country, the program, goals and options you chose, and your first name, age and gender (you can choose not to say). This data is used to process your order, adapt and send your program, and keep the accounts (legal basis: performance of the contract and accounting obligations). Card details are entered directly with Stripe: 6M Lab never has access to them.",
          "When you email us: your address and your message, to reply to you (legal basis: legitimate interest).",
          "After a purchase, we send you two optional questionnaires (2 weeks after the purchase and at the end of the program). Your answers are used to improve the programs (legal basis: legitimate interest). Your review and rating are only published on the website with your consent, with your first name only (legal basis: consent, which you can withdraw at any time by emailing us).",
          "Free session: your email address and language, to send you the session and then 3 training tips emails over about ten days (legal basis: consent, given by asking for the session). Every email has a one-click unsubscribe link.",
          "Fitness & well-being waiting list: your email address and language, to send you a single email on launch day (legal basis: consent). You can unsubscribe at any time.",
          "Fitness & well-being questionnaire: your first name, age, choices (goal, level, place, available time) and, only if you tick the box, your body type, pain, height and weight. This information is used only to prepare your program (legal basis: explicit consent). It is never published or used for anything else, and you can ask for it to be deleted at any time.",
          "The questionnaire: your answers stay in your browser. They are neither sent nor saved.",
          "Technical data: the host keeps logs (IP address, pages viewed) needed to run and secure the website (legal basis: legitimate interest).",
        ]] },
        { h: "Cookies", body: [
          "The website uses no analytics or advertising cookies. The Stripe payment page may set cookies that are strictly necessary for payment security and fraud prevention, which do not require your consent.",
        ] },
        { h: "Recipients", body: [
          "Your data is never sold. It is only shared with the providers needed to run the service:",
          ["Stripe (payment)", "Vercel (website hosting)", "Apple (iCloud Mail, for emails)"],
          "Some of these providers may process data outside the European Union, in particular in the United States. These transfers are covered by the EU–US Data Privacy Framework or by the European Commission's standard contractual clauses.",
        ] },
        { h: "Retention", body: [[
          "Orders and invoices: 10 years, as required by accounting rules.",
          "Email exchanges: 3 years after our last exchange.",
          "Questionnaire answers: 3 years. Published reviews: until you ask for their removal.",
          "Free session: your email address is kept for 3 years after your request, or less if you ask us to erase it.",
          "Technical logs: a limited period set by the host.",
        ]] },
        { h: "Your rights", body: [
          `You can ask to access, correct, erase or port your data, restrict its processing or object to it, by writing to ${o.email}. We reply within one month.`,
          "If you believe your rights have not been respected, you can complain to the French data protection authority, the CNIL (cnil.fr).",
        ] },
      ],
    },
    cgv: {
      title: "Terms of sale",
      desc: "Terms of sale for 6M Lab physical training programs.",
      intro: "This is a translation. The French version of these terms is the one that applies.",
      sections: [
        { h: "1. Purpose", body: [
          `These terms govern the online sale of 6M Lab programs to consumers. The seller is ${o.name}, sole trader (French micro-entreprise), ${o.address}, SIRET ${o.siret}, reachable at ${o.email}.`,
          "Placing an order means accepting these terms, which may change at any time. The terms that apply are those in force on the day of the order.",
        ] },
        { h: "2. The programs", body: [
          "The programs are digital content: a PDF with the full week-by-week plan, and animations showing every exercise, available online. When ordering, the buyer chooses one of the goals offered, or the return-to-play program on its own. The buyer can add a second goal, sold for €5 on top of the program. The buyer can add the running option, an additional program of 30 to 45 minute running sessions, sold for €9 on top of the program. Each program's content and length are described on its page.",
          "The programs cover training only. They include no meal plan and no individual coaching.",
          "They are intended for healthy people. If you have an injury, pain or any doubt about your health, see a doctor before starting. The buyer remains responsible for adapting the effort to their fitness and for following the instructions.",
        ] },
        { h: "3. Prices", body: [
          "Prices are shown in euros, all taxes included. VAT not applicable, article 293 B of the French General Tax Code. The price charged is the one shown when the order is placed.",
        ] },
        { h: "4. Ordering", body: [
          "To order, the buyer chooses a program, their goals and, if they wish, the running option, accepts these terms, asks for the contract to be performed immediately and waives the right of withdrawal as set out in section 7, then pays.",
          "If the buyer is a minor, the order must be placed with the consent of a parent or legal guardian. The contract is concluded once payment is confirmed. An order confirmation is sent by email, stating the program, its price, these terms and the buyer's consent mentioned above.",
        ] },
        { h: "5. Payment", body: [
          "Payment is made by card through the secure provider Stripe. The amount is charged when the order is placed. 6M Lab never has access to the buyer's card details.",
        ] },
        { h: "6. Delivery", body: [
          "The program is sent by email to the address given at payment, within 48 hours. If you have not received it by then, check your spam folder, then contact us.",
        ] },
        { h: "7. Right of withdrawal", body: [
          "Under article L221-28, 13° of the French Consumer Code, the right of withdrawal cannot be exercised for digital content not supplied on a tangible medium once performance has begun with the consumer's prior express consent and waiver of the right of withdrawal.",
          `By ticking the box when ordering, the buyer gives this consent. Performance begins when the program is sent. Until then, the buyer can withdraw by writing to ${o.email}, for example using the template below, and is refunded within 14 days by the same means of payment.`,
          `Withdrawal template: "To ${o.name}, 6M Lab, ${o.address}, ${o.email}. I hereby give notice that I withdraw from the contract for the following program: [program], ordered on [date]. Name: [name]. Email used for the order: [email]. Date: [date]."`,
        ] },
        { h: "8. Conformity guarantee", body: [
          "The seller is liable for any lack of conformity of the digital content under articles L224-25-12 and following of the French Consumer Code. If there is a problem (unreadable file, animation not accessible), contact us: the program will be brought into conformity or, failing that, the price will be reduced or refunded.",
        ] },
        { h: "9. Use of the programs", body: [
          "Buying a program grants a personal, non-transferable right to use it. Reselling, sharing or distributing it, in whole or in part, without written permission is prohibited.",
        ] },
        { h: "10. Liability", body: [
          "6M Lab cannot be held liable for any harm resulting from exercises performed incorrectly, failure to follow the instructions, or training despite a medical contraindication.",
        ] },
        { h: "11. Personal data", body: ["Data collected when ordering is handled as described in the privacy policy."] },
        { h: "12. Complaints and mediation", body: [
          `For any complaint, first write to ${o.email}. If no solution is found, you can refer the matter free of charge to the consumer mediator: ${o.mediator}.`,
        ] },
        { h: "13. Customer reviews", body: [
          "After the purchase, the buyer receives two optional questionnaires by email, 2 weeks after the purchase and at the end of the program. The reviews published on the website only come from these questionnaires, so from verified buyers. For answering the final questionnaire, the buyer receives a 15% discount code for a next program, whatever the content of the review.",
          "Reviews are not edited. Only those whose author agreed to publication are shown, with the first name and the date of the review. The average rating shown takes into account every answer to the final questionnaire, including unpublished reviews. The author can ask for their review to be removed at any time.",
        ] },
        { h: "14. Governing law", body: [
          "These terms are governed by French law. In the event of a dispute, the consumer may bring the matter before the court of their place of residence or any other competent court.",
        ] },
      ],
    },
  },
};
