import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import nodemailer from "nodemailer";
import type { Lang } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { goalOrder, goalsTitle, type GoalId } from "@/lib/goals";
import { buy, fmtPrice, type Place } from "@/lib/checkout";
import { legalPaths, owner } from "@/lib/legal";
import { SITE } from "@/lib/dict";

export type Order = {
  id: string;
  email: string;
  lang: Lang;
  program: ProgramSlug;
  goals: GoalId[];
  running: boolean;
  lieu: Place;
  pack?: boolean;
  firstName: string;
  age: string;
  gender: string;
  amount: number;
};

// Sent through iCloud Mail by default, with an app-specific password (appleid.apple.com >
// Sign-In and Security > App-Specific Passwords). MAIL_SERVICE=gmail switches to Gmail.
// MAIL_USER is the account login (for iCloud, the main address of the Apple account). MAIL_FROM
// is the address emails are sent from and 6M Lab's inbox, e.g. an iCloud alias of that account.
const MAIL_FROM = () => process.env.MAIL_FROM || process.env.MAIL_USER;
export const mailReady = () => !!(process.env.MAIL_USER && process.env.MAIL_PASSWORD);
// MAIL_DRY_RUN=1 builds the emails without sending them (local development).
const transport = () =>
  process.env.MAIL_DRY_RUN === "1"
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({ service: process.env.MAIL_SERVICE || "iCloud", auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// The PDFs an order needs, from the programmes/ folder: the guide of the formula, the sessions
// for its pair of goals (in block order, with the customer's silhouette) and the running option.
// Returns null unless automatic sending is switched on (PROGRAMMES_ENVOI_AUTO=1, once the
// programs are validated) and every file exists, so a customer never gets a draft or half a
// program.
// True when the PDFs go out automatically with the confirmation (every combination except
// réathlétisation, whose program is not written yet).
export const deliversNow = (goals: string[]) => process.env.PROGRAMMES_ENVOI_AUTO === "1" && !goals.includes("reathletisation");

export async function programFiles(o: Order) {
  if (!deliversNow(o.goals)) return null;
  const goals = [...o.goals].sort((a, b) => goalOrder.indexOf(a) - goalOrder.indexOf(b));
  // The "Saison complète" pack adds the Maintien en saison with the same goals.
  const formulas = o.pack ? [o.program, "maintien-saison"] : [o.program];
  const names = [...formulas.flatMap((f) => [`guide-${f}.pdf`, `seances-${f}-${goals.join("-")}.pdf`]), ...(o.running ? ["option-course.pdf"] : [])];
  // Each file exists for the place chosen at checkout (maison, salle), and the sessions also with
  // the silhouette matching the gender (femme, homme). The customer gets them under the names
  // above.
  const sil = o.gender === "femme" || o.gender === "homme" ? `-${o.gender}` : "";
  const paths = names.map((n) => join(process.cwd(), "programmes", n.replace(/\.pdf$/, `-${o.lieu}${n.startsWith("seances-") ? sil : ""}.pdf`)));
  try {
    await Promise.all(paths.map((p) => access(p)));
  } catch {
    return null;
  }
  return Promise.all(names.map(async (filename, i) => ({ filename, content: await readFile(paths[i]) })));
}

export async function sendConfirmation(o: Order) {
  const fr = o.lang === "fr";
  const p = programs[o.lang][o.program];
  const files = await programFiles(o);
  const rows: [string, string][] = [
    [fr ? "Programme" : "Program", o.pack
      ? `${fr ? "Pack Saison complète" : "Full season pack"} : ${p.name} (${p.duration}) + ${programs[o.lang]["maintien-saison"].name} (${programs[o.lang]["maintien-saison"].duration})`
      : `${p.name} (${p.duration})`],
    [fr ? "Objectifs" : "Goals", goalsTitle(o.goals, o.lang)],
    [fr ? "Lieu" : "Place", buy[o.lang].places[o.lieu][0]],
    ...(o.running ? [[fr ? "Option" : "Option", fr ? "Programme course à pied" : "Running program"] as [string, string]] : []),
    [fr ? "Total payé" : "Total paid", fmtPrice(o.amount, o.lang)],
    [fr ? "Référence" : "Reference", o.id.slice(-12)],
  ];
  const delivery = files
    ? fr ? "Ton programme est joint à cet email. Bonne préparation !" : "Your program is attached to this email. Enjoy your training!"
    : fr ? "Ton programme te sera envoyé à cette adresse sous 48 heures." : "Your program will be sent to this address within 48 hours.";
  const legal = fr
    ? `Tu as accepté les conditions générales de vente (${SITE}${legalPaths.fr.cgv}), demandé l'accès immédiat au programme et reconnu perdre ton droit de rétractation une fois le programme envoyé. Vendeur : ${owner.name}, entrepreneur individuel, ${owner.address}, SIRET ${owner.siret}. TVA non applicable, art. 293 B du CGI.`
    : `You accepted the terms of sale (${SITE}${legalPaths.en.cgv}), asked for immediate access to the program and acknowledged losing your right of withdrawal once the program has been sent. Seller: ${owner.name}, sole trader, ${owner.address}, SIRET ${owner.siret}. VAT not applicable, art. 293 B of the French General Tax Code.`;
  const hello = fr ? `Bonjour ${o.firstName},` : `Hi ${o.firstName},`;
  const intro = fr ? "Merci pour ta commande, elle est bien confirmée." : "Thank you for your order, it is confirmed.";
  const health = fr
    ? "Nos programmes sont destinés aux personnes en bonne santé. En cas de doute ou de blessure, demande l'avis d'un professionnel de santé."
    : "Our programs are for healthy people. If you have doubts or an injury, ask a health professional first.";

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#100A24">
  <div style="background:#16123F;padding:16px 20px;border-radius:12px 12px 0 0"><img src="${SITE}/brand/logo-email.png" width="189" height="56" alt="6M Lab · Be ready." style="display:block;border:0;color:#FFC75F;font:700 22px Arial"></div>
  <div style="border:1px solid #E3E0F0;border-top:0;border-radius:0 0 12px 12px;padding:24px">
    <p>${esc(hello)}</p><p>${intro}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#5B5673;border-bottom:1px solid #E3E0F0">${k}</td><td style="padding:8px 0;text-align:right;font-weight:700;border-bottom:1px solid #E3E0F0">${esc(v)}</td></tr>`).join("")}</table>
    <p style="font-weight:700">${delivery}</p>
    <p>${fr ? "Une question ? Réponds simplement à cet email." : "Any question? Just reply to this email."}</p>
    <p style="font-size:12px;color:#5B5673;margin-top:24px">${esc(health)}</p>
    <p style="font-size:12px;color:#5B5673">${esc(legal)}</p>
  </div></div>`;
  const text = [hello, "", intro, "", ...rows.map(([k, v]) => `${k} : ${v}`), "", delivery, "", health, "", legal].join("\n");

  const info = await transport().sendMail({
    from: `6M Lab <${MAIL_FROM()}>`,
    to: o.email,
    replyTo: owner.email,
    subject: fr ? "Ta commande 6M Lab est confirmée" : "Your 6M Lab order is confirmed",
    html,
    text,
    attachments: files ?? undefined,
  });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
  return !!files;
}

// Heads-up to 6M Lab with everything needed to prepare and send the program by hand.
export async function notifyOwner(o: Order, delivered: boolean) {
  const lines = [
    `Programme : ${programs.fr[o.program].name}`,
    `Objectifs : ${goalsTitle(o.goals, "fr")}`,
    `Lieu : ${buy.fr.places[o.lieu][0]}`,
    `Pack Saison complète (+ Maintien) : ${o.pack ? "oui" : "non"}`,
    `Option course : ${o.running ? "oui" : "non"}`,
    `Prénom : ${o.firstName}`,
    `Âge : ${o.age}`,
    `Genre : ${o.gender}`,
    `Email : ${o.email}`,
    `Langue : ${o.lang}`,
    `Montant : ${fmtPrice(o.amount, "fr")}`,
    `Référence Stripe : ${o.id}`,
    "",
    delivered ? "Programme envoyé automatiquement en pièce jointe." : "À FAIRE : envoyer le programme sous 48 heures (répondre au client à cette adresse).",
  ];
  const info = await transport().sendMail({
    from: `6M Lab <${MAIL_FROM()}>`,
    to: MAIL_FROM(),
    replyTo: o.email,
    subject: `${delivered ? "Nouvelle commande" : "Nouvelle commande à envoyer"} : ${o.firstName}, ${programs.fr[o.program].name}`,
    text: lines.join("\n"),
  });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Shared frame of the customer emails: header with the logo, then the content.
const frame = (body: string) => `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#100A24">
  <div style="background:#16123F;padding:16px 20px;border-radius:12px 12px 0 0"><img src="${SITE}/brand/logo-email.png" width="189" height="56" alt="6M Lab · Be ready." style="display:block;border:0;color:#FFC75F;font:700 22px Arial"></div>
  <div style="border:1px solid #E3E0F0;border-top:0;border-radius:0 0 12px 12px;padding:24px">${body}</div></div>`;
const button = (href: string, label: string) => `<p style="margin:24px 0"><a href="${href}" style="background:#FF7A59;color:#100A24;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;display:inline-block">${label}</a></p>`;

// Feedback request: "mid" 2 weeks after the purchase, "end" when the program is over.
export async function sendFeedbackRequest(o: { email: string; lang: Lang; firstName: string; program: ProgramSlug }, stage: "mid" | "end", link: string, promoPercent: number) {
  const fr = o.lang === "fr";
  const p = programs[o.lang][o.program];
  const hello = fr ? `Bonjour ${o.firstName},` : `Hi ${o.firstName},`;
  const lines = stage === "mid"
    ? fr
      ? [`Tu as commencé ton programme ${p.name} il y a deux semaines. Comment ça se passe ?`, "4 questions, 1 minute : ça nous aide à corriger vite ce qui bloque."]
      : [`You started your ${p.name} program two weeks ago. How is it going?`, "4 questions, 1 minute: it helps us fix quickly anything that gets in the way."]
    : fr
      ? [`Ton programme ${p.name} touche à sa fin : bravo pour le travail !`, `Donne-nous ton avis en 2 minutes. Pour te remercier, tu recevras un code de -${promoPercent} % sur ton prochain programme, quel que soit ton avis.`]
      : [`Your ${p.name} program is coming to an end: well done!`, `Tell us what you think in 2 minutes. As a thank-you, you will get a ${promoPercent}% discount code for your next program, whatever your feedback.`];
  const cta = stage === "mid" ? (fr ? "Répondre (1 min)" : "Answer (1 min)") : (fr ? "Donner mon avis" : "Give my feedback");
  const subject = stage === "mid" ? (fr ? "Tes 2 premières semaines : comment ça se passe ?" : "Your first 2 weeks: how is it going?") : (fr ? "Ton avis sur ton programme 6M Lab" : "Your feedback on your 6M Lab program");
  const html = frame(`<p>${esc(hello)}</p>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}${button(link, cta)}<p style="font-size:12px;color:#5B5673">${fr ? "Ce lien est personnel. Tu peux aussi répondre directement à cet email." : "This link is personal. You can also simply reply to this email."}</p>`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: o.email, replyTo: owner.email, subject, html, text: [hello, "", ...lines, "", `${cta} : ${link}`].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// The discount code, sent after the final questionnaire so the customer keeps it.
export async function sendPromoCode(o: { email: string; lang: Lang; firstName: string }, code: string, promoPercent: number) {
  const fr = o.lang === "fr";
  const hello = fr ? `Bonjour ${o.firstName},` : `Hi ${o.firstName},`;
  const l1 = fr ? "Merci pour ton avis !" : "Thank you for your feedback!";
  const l2 = fr ? `Voici ton code de -${promoPercent} % sur ton prochain programme 6M Lab, valable un an, à saisir au moment du paiement :` : `Here is your ${promoPercent}% discount code for your next 6M Lab program, valid for one year, to enter at checkout:`;
  const html = frame(`<p>${esc(hello)}</p><p>${l1}</p><p>${l2}</p><p style="font:700 22px Arial;letter-spacing:2px;background:#F5EDF0;border-radius:10px;padding:14px;text-align:center">${esc(code)}</p>${button(`${SITE}/${o.lang}/programmes`, fr ? "Voir les programmes" : "See the programs")}`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: o.email, replyTo: owner.email, subject: fr ? `Ton code de -${promoPercent} %` : `Your ${promoPercent}% discount code`, html, text: [hello, "", l1, l2, code].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// ---- Free session (home page) -------------------------------------------------------------

const unsubFooter = (lang: Lang, unsub: string) =>
  `<p style="font-size:12px;color:#5B5673;margin-top:24px">${lang === "fr" ? "Tu reçois cet email parce que tu as demandé la séance gratuite 6M Lab." : "You get this email because you asked for the free 6M Lab session."} <a href="${unsub}" style="color:#5B5673">${lang === "fr" ? "Se désinscrire" : "Unsubscribe"}</a></p>`;
const leadMail = async (to: string, lang: Lang, unsub: string, subject: string, paras: string[], cta: [string, string] | null, attachments?: { filename: string; content: Buffer }[]) => {
  const html = frame(`${paras.map((l) => `<p>${l}</p>`).join("")}${cta ? button(cta[1], cta[0]) : ""}${unsubFooter(lang, unsub)}`);
  const text = [...paras.map((l) => l.replace(/<[^>]+>/g, "")), "", ...(cta ? [`${cta[0]} : ${cta[1]}`] : []), "", `${lang === "fr" ? "Se désinscrire" : "Unsubscribe"} : ${unsub}`].join("\n\n");
  const info = await transport().sendMail({
    from: `6M Lab <${MAIL_FROM()}>`, to, replyTo: owner.email, subject, html, text, attachments,
    headers: { "List-Unsubscribe": `<${unsub}>` },
  });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
};

// The session PDF, right after the request.
export async function sendFreeSession(to: string, lang: Lang, unsub: string) {
  const fr = lang === "fr";
  const content = await readFile(join(process.cwd(), "programmes", "seance-decouverte.pdf"));
  await leadMail(to, lang, unsub, fr ? "Ta séance gratuite 6M Lab" : "Your free 6M Lab session",
    fr
      ? ["Salut,", "Voici ta séance découverte en pièce jointe : 15 minutes de prévention des blessures pour le handball, sans matériel. Touche l'œil à côté de chaque exercice pour le voir en mouvement.", "Fais-la 2 fois par semaine, en fin d'échauffement ou un jour sans handball. Dans les prochains jours, je t'envoie 3 conseils pour mieux te préparer.", "Raphaël, 6M Lab"]
      : ["Hi,", "Here is your free session, attached: 15 minutes of injury prevention for handball, no equipment. Tap the eye next to each exercise to see it in motion.", "Do it twice a week, at the end of your warm-up or on a day without handball. Over the next few days, I'll send you 3 tips to prepare better.", "Raphaël, 6M Lab"],
    [fr ? "Voir les programmes complets" : "See the full programs", `${SITE}/${lang}/programmes`],
    [{ filename: fr ? "6M-Lab-seance-decouverte.pdf" : "6M-Lab-free-session.pdf", content }]);
}

// The 3 tips, 2, 5 and 9 days after the request.
export const TIP_DAYS = [2, 5, 9];
export async function sendTip(to: string, lang: Lang, n: 1 | 2 | 3, unsub: string) {
  const fr = lang === "fr";
  const anim = (id: string) => `${SITE}/fr/exercices/${id}`;
  const tips = {
    1: fr
      ? { s: "Le geste qui protège tes genoux", p: ["Salut,", "Au handball, beaucoup de blessures au genou arrivent à la <strong>réception d'un saut</strong> ou lors d'un <strong>changement de direction</strong>, souvent sans aucun contact.", "La règle d'or : à chaque réception, <strong>genoux dans l'axe des orteils</strong>, jamais vers l'intérieur, et une réception silencieuse, en amortissant avec les hanches.", "C'est exactement ce que travaille le « Petit saut, réception stabilisée » de ta séance. Revois-le en animation :"], c: ["Voir l'exercice", anim("saut-reception")] }
      : { s: "The move that protects your knees", p: ["Hi,", "In handball, many knee injuries happen when <strong>landing from a jump</strong> or <strong>changing direction</strong>, often with no contact at all.", "The golden rule: every time you land, <strong>knees in line with your toes</strong>, never caving in, and a quiet landing, absorbing with your hips.", "That's exactly what the “small jump, stable landing” in your session trains. See it in motion:"], c: ["See the exercise", anim("saut-reception")] },
    2: fr
      ? { s: "L'exercice n°1 pour tes ischios", p: ["Salut,", "Les ischios (l'arrière de la cuisse) font partie des muscles qui se blessent le plus dans les sports de sprint, et le handball en est un.", "Le <strong>Nordic ischios</strong> est l'exercice de prévention le mieux étudié : dans les études, les sportifs qui le pratiquent régulièrement ont jusqu'à 2 fois moins de blessures aux ischios.", "Le secret : descendre <strong>le plus lentement possible</strong>, corps droit. Si tu débutes, descends seulement à mi-chemin."], c: ["Voir le Nordic en animation", anim("nordic")] }
      : { s: "The #1 exercise for your hamstrings", p: ["Hi,", "Hamstrings (the back of the thigh) are among the most injured muscles in sprint sports, and handball is one of them.", "The <strong>Nordic hamstring curl</strong> is the best-studied prevention exercise: in studies, athletes who do it regularly get up to half as many hamstring injuries.", "The secret: lower yourself <strong>as slowly as possible</strong>, body straight. If you're a beginner, only go halfway down."], c: ["See the Nordic in motion", anim("nordic")] },
    3: fr
      ? { s: "Où placer ta prépa dans ta semaine", p: ["Salut,", "Une bonne séance mal placée peut te coûter un match. Trois règles simples :", "1. La séance la plus dure <strong>au moins 3 jours avant le match</strong>.<br>2. Une séance plus légère <strong>au plus tard 2 jours avant</strong>.<br>3. <strong>Jamais la veille</strong> d'un match.", "C'est la logique de tous les programmes 6M Lab : chaque séance est écrite en entier et placée pour que tu arrives frais le jour du match. Avant la saison, la <strong>Pré-saison</strong> (8 semaines) ; pendant la saison, le <strong>Maintien</strong> (2 séances courtes par semaine).", "Merci d'avoir suivi ces 3 conseils. Si tu as une question, réponds simplement à cet email.", "Raphaël, 6M Lab"], c: ["Voir les programmes", `${SITE}/fr/programmes`] }
      : { s: "Where to put your training in your week", p: ["Hi,", "A good session at the wrong time can cost you a game. Three simple rules:", "1. Your hardest session <strong>at least 3 days before the game</strong>.<br>2. A lighter session <strong>no later than 2 days before</strong>.<br>3. <strong>Never the day before</strong> a game.", "That's how every 6M Lab program works: each session is written out in full and placed so you arrive fresh on game day. Before the season, the <strong>Pre-season</strong> (8 weeks); during the season, the <strong>In-season maintenance</strong> (2 short sessions a week).", "Thanks for following these 3 tips. Any question? Just reply to this email.", "Raphaël, 6M Lab"], c: ["See the programs", `${SITE}/en/programmes`] },
  }[n];
  await leadMail(to, lang, unsub, tips.s, tips.p, tips.c as [string, string]);
}
