import { nextHref, nextStep, type NextStep } from "@/lib/next-step";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, SPONSOR_PERCENT, type PointsNews } from "@/lib/referral";
import { readProgram } from "@/lib/program-store";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { accessWeeks, MARGIN_WEEKS, MAX_DEVICES, offerOf, PROGRAM_WEEKS, type Offer } from "@/lib/access";
import { dayLabel } from "@/lib/season-parts";
import type { Lang } from "@/lib/dict";
import { programs, whenToStart, type ProgramSlug } from "@/lib/programs";
import { goalOrder, goalsTitle, type GoalId } from "@/lib/goals";
import { buy, fmtPrice, type Place } from "@/lib/checkout";
import { legalPaths, owner } from "@/lib/legal";
import { SITE } from "@/lib/dict";
import type { Campaign } from "@/lib/season-mail";
import { REPLY_HOURS } from "@/lib/replies";

export type Order = {
  id: string;
  email: string;
  lang: Lang;
  // Language of the program PDF (programmes/ or programmes/en/).
  plang: Lang;
  // The first (or only) part of the order.
  program: ProgramSlug;
  goals: GoalId[];
  running: boolean;
  lieu: Place;
  // Saison complète: its 3 parts in order and the day each one starts (lib/season-parts.ts).
  pack?: boolean;
  parts?: ProgramSlug[];
  starts?: number[];
  // Bought from the current week (pro rata): the week the first part starts at.
  debut?: number;
  // Weeks of program the order covers (the animations access).
  weeks?: number;
  firstName: string;
  age: string;
  gender: string;
  // Under 18: the parent or legal guardian who placed the order (terms of sale).
  parent?: string;
  amount: number;
  // The buyer's code to share with teammates (lib/referral.ts), when it could be created.
  referral?: string;
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

// Alert to 6M Lab when something fails (lib/alert.ts): plain text, to its own inbox.
export async function sendAlert(subject: string, text: string) {
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: MAIL_FROM(), subject: `⚠ 6M Lab : ${subject}`, text });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// The weekly backup of the site's data (lib/backup.ts), to 6M Lab's own mailbox, as an attachment.
export const backupName = (date: string) => `6mlab-sauvegarde-${date}.json.gz`;
export async function sendBackup(date: string, content: Buffer, summary: string[]) {
  const filename = backupName(date);
  const text = ["Sauvegarde hebdomadaire des données du site, en pièce jointe.", "", ...summary, "", "Garde ce fichier : il sert à tout remettre en place si les données du site sont perdues (npm run restaurer -- fichier.json.gz). Il contient des adresses email de clients : ne le transfère pas."].join("\n");
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: MAIL_FROM(), subject: `6M Lab : sauvegarde du ${date}`, text, attachments: [{ filename, content }] });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message).slice(0, 300));
}

// The PDFs an order needs, from the programmes/ folder: the guide of the formula, the sessions
// for its pair of goals (in block order, with the customer's silhouette) and the running option.
// Returns null unless automatic sending is switched on (PROGRAMMES_ENVOI_AUTO=1, once the
// programs are validated) and every file exists, so a customer never gets a draft or half a
// program.
// True when the PDFs go out automatically with the confirmation (every combination except
// réathlétisation, whose program is not written yet).
export const deliversNow = (goals: string[]) => process.env.PROGRAMMES_ENVOI_AUTO === "1" && !goals.includes("reathletisation");

// The files of one part of an order: the name the customer gets, and where the PDF is on disk.
// Also used by the admin page that finds an order's PDFs for sending by hand. The 2e partie has
// no PDF yet (its content is being written): it is sent by hand until then.
export type OrderFilesInput = Pick<Order, "program" | "goals" | "running" | "gender" | "lieu" | "plang">;
export function orderFiles(o: OrderFilesInput) {
  const goals = [...o.goals].sort((a, b) => goalOrder.indexOf(a) - goalOrder.indexOf(b));
  const names = [`guide-${o.program}.pdf`, `seances-${o.program}-${goals.join("-")}.pdf`, ...(o.running ? ["option-course.pdf"] : [])];
  // Each file exists for the place chosen at checkout (maison, salle), and the sessions also with
  // the silhouette matching the gender (femme, homme). The customer gets them under the names
  // above.
  const sil = o.gender === "femme" || o.gender === "homme" ? `-${o.gender}` : "";
  // path: inside programmes/ (lib/program-store.ts reads it from the Blob store or the folder).
  const dir = o.plang === "en" ? "en/" : "";
  return names.map((filename) => ({ filename, path: dir + filename.replace(/\.pdf$/, `-${o.lieu}${filename.startsWith("seances-") ? sil : ""}.pdf`) }));
}

// The PDFs of one part of an order (the first by default), or null when they cannot go out
// automatically: not switched on, not written yet, or bought from the current week (that PDF,
// starting at a given week, is not produced yet either).
export async function programFiles(o: Order, part: ProgramSlug = o.program) {
  if (!deliversNow(o.goals) || (o.debut && part === o.program)) return null;
  const files = orderFiles({ ...o, program: part });
  const pdfs = await Promise.all(files.map((f) => readProgram(f.path)));
  if (pdfs.some((p) => !p)) return null;
  const ref = o.id.slice(-12);
  return Promise.all(files.map(async ({ filename }, i) => ({ filename, content: await personal(pdfs[i]!, o.firstName, ref, o.plang) })));
}

// Each PDF carries the customer's first name and order reference at the foot of every page:
// people think twice before passing on a document with someone's name on it. Falls back to the
// plain file if the stamp fails.
export async function personal(pdf: Buffer, firstName: string, ref: string, lang: Lang = "fr"): Promise<Buffer> {
  try {
    const doc = await PDFDocument.load(pdf);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    // The standard font only covers Latin-1: other characters are dropped.
    const text = (lang === "en" ? `Personal program of ${firstName || "customer"} · Ref. ${ref} · Personal use only, please do not share.` : `Programme personnel de ${firstName || "client"} · Réf. ${ref} · Usage personnel, merci de ne pas le diffuser.`).replace(/[^\x20-\xFF·]/g, "").replace(/·/g, "-");
    for (const page of doc.getPages()) {
      const { width } = page.getSize(), size = 6.5, w = font.widthOfTextAtSize(text, size);
      page.drawText(text, { x: (width - w) / 2, y: 7, size, font, color: rgb(0.55, 0.53, 0.62) });
    }
    return Buffer.from(await doc.save());
  } catch (e) {
    console.error("[pdf stamp]", e);
    return pdf;
  }
}

export async function sendConfirmation(o: Order) {
  const fr = o.lang === "fr";
  const p = programs[o.lang][o.program];
  const files = await programFiles(o);
  const rows: [string, string][] = [
    [fr ? "Programme" : "Program", o.pack
      ? `${fr ? "Saison complète" : "Full season"} : ${(o.parts ?? [o.program]).map((x, i) => `${programs[o.lang][x].name} (${i === 0 ? (o.debut ? buy[o.lang].fromWeek(o.debut).toLowerCase() : fr ? "maintenant" : "now") : `${fr ? "à partir du" : "from"} ${o.starts?.[i] ? dayLabel(o.starts[i], o.lang) : ""}`})`).join(", ")}`
      : `${p.name} (${o.debut ? buy[o.lang].fromWeek(o.debut).toLowerCase() : p.duration})`],
    [fr ? "Objectifs" : "Goals", goalsTitle(o.goals, o.lang)],
    [fr ? "Lieu" : "Place", buy[o.lang].places[o.lieu][0]],
    ...(o.parent ? [[fr ? "Commandé par (parent ou représentant légal)" : "Ordered by (parent or legal guardian)", o.parent] as [string, string]] : []),
    [buy[o.lang].plangT, buy[o.lang].plangs[o.plang]],
    ...(o.running ? [[fr ? "Option" : "Option", fr ? "Programme course à pied" : "Running program"] as [string, string]] : []),
    [fr ? "Total payé" : "Total paid", fmtPrice(o.amount, o.lang)],
    [fr ? "Référence" : "Reference", o.id.slice(-12)],
  ];
  const delivery = (files
    ? fr ? "Ton programme est joint à cet email. Bonne préparation !" : "Your program is attached to this email. Enjoy your training!"
    : fr ? "Ton programme te sera envoyé à cette adresse sous 48 heures." : "Your program will be sent to this address within 48 hours.")
    + (o.pack ? (fr ? " Les parties suivantes t'arriveront par email une semaine avant leur début." : " The next parts will reach you by email a week before they start.") : "");
  const legal = fr
    ? `Tu as accepté les conditions générales de vente (${SITE}${legalPaths.fr.cgv}), demandé l'accès immédiat au programme et reconnu perdre ton droit de rétractation une fois le programme envoyé. Vendeur : ${owner.name}, entrepreneur individuel, ${owner.address}, SIRET ${owner.siret}. TVA non applicable, art. 293 B du CGI.`
    : `You accepted the terms of sale (${SITE}${legalPaths.en.cgv}), asked for immediate access to the program and acknowledged losing your right of withdrawal once the program has been sent. Seller: ${owner.name}, sole trader, ${owner.address}, SIRET ${owner.siret}. VAT not applicable, art. 293 B of the French General Tax Code.`;
  const hello = fr ? `Bonjour ${o.firstName},` : `Hi ${o.firstName},`;
  const intro = fr ? "Merci pour ta commande, elle est bien confirmée." : "Thank you for your order, it is confirmed.";
  // The animations: opened from the customer area, with the order reference and a 6-digit code.
  const weeks = (o.weeks ?? PROGRAM_WEEKS[o.pack ? "pack" : offerOf({ program: o.program })]) + MARGIN_WEEKS;
  const anims = fr
    ? [`Tes animations : touche l'œil à côté de chaque exercice de ton programme, ou ouvre la bibliothèque d'exercices. Connecte-toi à ton espace client avec ta référence de commande (${o.id.slice(-12)}) : tu reçois un code à 6 chiffres par email, puis tu actives ta bibliothèque.`,
      `Ton accès démarre quand tu actives ta bibliothèque (on te demandera de confirmer) et dure ${weeks} semaines (la durée de ton programme + 2 semaines). Ouvre-le le jour où tu commences, dans les 12 mois, sur ${MAX_DEVICES} appareils au plus. Ton PDF, lui, reste à toi.`]
    : [`Your animations: tap the eye next to each exercise in your program, or open the exercise library. Log in to your customer area with your order reference (${o.id.slice(-12)}): you get a 6-digit code by email, then you activate your library.`,
      `Your access starts when you activate your library (you will be asked to confirm) and lasts ${weeks} weeks (your program + 2 weeks). Open it on the day you start, within 12 months, on ${MAX_DEVICES} devices at most. Your PDF is yours to keep.`];
  const lib = `${SITE}/${o.lang}/espace-client`;
  // Pré-saison (alone or in the pack): when to do it (lib/programs.ts whenToStart).
  const w = whenToStart[o.lang];
  const when = o.program === "pre-saison"
    ? [fr ? "Quand commencer ta Pré-saison ?" : "When to start your Pre-season?", w.lead, ...w.cases.map((c) => `${c.t} : ${c.d}`)]
    : [];
  // Referral (lib/referral.ts): the code to share with teammates.
  const par = o.referral ? (fr
    ? ["Parraine tes coéquipiers", `Donne-leur ton code ${o.referral} : ils ont -${FRIEND_PERCENT} % sur leur programme (à saisir sur la page de paiement). Chaque coéquipier qui commande te rapporte ${POINTS_PER_FRIEND} points ; à ${POINTS_FOR_REWARD} points, tu reçois -${SPONSOR_PERCENT} % sur ton prochain programme. Suis tes points dans ton espace client : ${SITE}/fr/espace-client.`]
    : ["Refer your teammates", `Give them your code ${o.referral}: they get ${FRIEND_PERCENT}% off their program (entered on the payment page). Every teammate who orders earns you ${POINTS_PER_FRIEND} points; at ${POINTS_FOR_REWARD} points, you get ${SPONSOR_PERCENT}% off your next program. Follow your points in your customer area: ${SITE}/en/espace-client.`]) : null;
  const health = fr
    ? "Nos programmes sont destinés aux personnes en bonne santé. En cas de doute ou de blessure, demande l'avis d'un professionnel de santé."
    : "Our programs are for healthy people. If you have doubts or an injury, ask a health professional first.";

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#100A24">
  <div style="background:#16123F;padding:16px 20px;border-radius:12px 12px 0 0"><img src="${SITE}/brand/logo-email.png" width="189" height="56" alt="6M Lab · Be ready." style="display:block;border:0;color:#FFC75F;font:700 22px Arial"></div>
  <div style="border:1px solid #E3E0F0;border-top:0;border-radius:0 0 12px 12px;padding:24px">
    <p>${esc(hello)}</p><p>${intro}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#5B5673;border-bottom:1px solid #E3E0F0">${k}</td><td style="padding:8px 0;text-align:right;font-weight:700;border-bottom:1px solid #E3E0F0">${esc(v)}</td></tr>`).join("")}</table>
    <p style="font-weight:700">${delivery}</p>
    ${when.length ? `<div style="border-left:4px solid #FF7A59;padding:2px 0 2px 14px;margin:16px 0"><p style="margin:0 0 8px;font-weight:700">${esc(when[0])}</p>${when.slice(1).map((l) => `<p style="margin:0 0 8px">${esc(l)}</p>`).join("")}</div>` : ""}
    <div style="background:#F5F3FB;border-radius:10px;padding:14px 16px;margin:16px 0">${anims.map((l) => `<p style="margin:0 0 8px">${esc(l)}</p>`).join("")}<p style="margin:0"><a href="${lib}" style="color:#C4452A;font-weight:700">${fr ? "Ouvrir mon espace client" : "Open my customer area"}</a></p></div>
    ${par ? `<div style="border:2px dashed #FF7A59;border-radius:10px;padding:14px 16px;margin:16px 0"><p style="margin:0 0 8px;font-weight:700">${esc(par[0])}</p><p style="margin:0 0 10px">${esc(par[1])}</p><p style="margin:0;font:700 20px Arial;letter-spacing:2px;text-align:center">${esc(o.referral!)}</p></div>` : ""}
    <p>${fr ? "Une question ? Réponds simplement à cet email." : "Any question? Just reply to this email."}</p>
    <p style="font-size:12px;color:#5B5673;margin-top:24px">${esc(health)}</p>
    <p style="font-size:12px;color:#5B5673">${esc(legal)}</p>
  </div></div>`;
  const text = [hello, "", intro, "", ...rows.map(([k, v]) => `${k} : ${v}`), "", delivery, "", ...(when.length ? [...when, ""] : []), ...anims, lib, "", ...(par ? [...par, ""] : []), health, "", legal].join("\n");

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
    `Programme : ${o.pack ? `Saison complète : ${(o.parts ?? [o.program]).map((x, i) => `${programs.fr[x].name}${i && o.starts?.[i] ? ` (à envoyer avant le ${dayLabel(o.starts[i], "fr")})` : ""}`).join(", ")}` : programs.fr[o.program].name}`,
    ...(o.debut ? [`Début : semaine ${o.debut} de la ${programs.fr[o.program].name} (prorata, ${o.weeks ?? "?"} semaines de programme au total) : PDF à préparer à partir de cette semaine`] : []),
    `Objectifs : ${goalsTitle(o.goals, "fr")}`,
    `Lieu : ${buy.fr.places[o.lieu][0]}`,
    `Langue du programme : ${o.plang === "en" ? "ANGLAIS (dossier programmes/en)" : "français"}`,
    `Option course : ${o.running ? "oui" : "non"}`,
    `Prénom : ${o.firstName}`,
    `Âge : ${o.age}`,
    ...(o.parent ? [`Mineur : commande passée par ${o.parent} (parent ou représentant légal, accord coché)`] : []),
    `Genre : ${o.gender}`,
    `Email : ${o.email}`,
    `Langue : ${o.lang}`,
    `Montant : ${fmtPrice(o.amount, "fr")}`,
    `Référence Stripe : ${o.id}`,
    "",
    delivered ? "Programme envoyé automatiquement en pièce jointe." : "À FAIRE : envoyer le programme sous 48 heures (répondre au client à cette adresse).",
    ...(o.pack ? ["Les parties suivantes partent automatiquement par email 7 jours avant leur début quand leurs PDF existent ; sinon tu reçois un rappel pour les envoyer."] : []),
  ];
  const info = await transport().sendMail({
    from: `6M Lab <${MAIL_FROM()}>`,
    to: MAIL_FROM(),
    replyTo: o.email,
    subject: `${delivered ? "Nouvelle commande" : "Nouvelle commande à envoyer"} : ${o.firstName}, ${o.pack ? "Saison complète" : programs.fr[o.program].name}${o.debut ? ` (dès la semaine ${o.debut})` : ""}`,
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
export async function sendFeedbackRequest(o: { email: string; lang: Lang; firstName: string; program: ProgramSlug }, stage: "mid" | "end", link: string, promoPercent: number, next?: NextStep) {
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
  // At the end of the program: what comes next (lib/next-step.ts), below the questionnaire.
  const after = stage === "end" && next ? nextBlock(next, o.lang) : null;
  const html = frame(`<p>${esc(hello)}</p>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}${button(link, cta)}${after?.html ?? ""}<p style="font-size:12px;color:#5B5673">${fr ? "Ce lien est personnel. Tu peux aussi répondre directement à cet email." : "This link is personal. You can also simply reply to this email."}</p>`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: o.email, replyTo: owner.email, subject, html, text: [hello, "", ...lines, "", `${cta} : ${link}`, ...(after ? ["", ...after.text] : [])].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// A week before the access to the animations ends (lib/access.ts): the date, and what to do next.
export async function sendAccessEnding(o: { email: string; lang: Lang; firstName: string; offer: Offer; goals: GoalId[] }, end: number) {
  const fr = o.lang === "fr";
  const date = new Date(end).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", timeZone: "Europe/Paris" });
  const hello = fr ? `Bonjour ${o.firstName},` : `Hi ${o.firstName},`;
  // The program ended 2 weeks before the access (lib/access.ts MARGIN_WEEKS): what comes next.
  const next = nextStep(o.offer, end - MARGIN_WEEKS * 7 * 86400000, o.goals, o.lang);
  const lines = fr
    ? [`Ton accès aux animations se termine le ${date}. Ton PDF, lui, reste à toi : tu peux continuer à t'en servir.`, `${next.t}. ${next.p}`, "Si tu as répondu au questionnaire de fin de programme, pense à ton code de réduction."]
    : [`Your access to the animations ends on ${date}. Your PDF is yours to keep: you can go on using it.`, `${next.t}. ${next.p}`, "If you answered the end-of-program questionnaire, remember your discount code."];
  const link = nextHref(next, o.lang, true);
  const html = frame(`<p>${esc(hello)}</p>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}${button(link, next.cta)}`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: o.email, replyTo: owner.email, subject: fr ? "Ton accès aux animations se termine dans 7 jours" : "Your access to the animations ends in 7 days", html, text: [hello, "", ...lines, "", link].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Saison complète (app/api/cron): 7 days before a later part starts, its PDFs go out to the
// customer. When they cannot go out automatically (not written yet), 6M Lab is asked to send them
// by hand and the customer is told they are coming. Returns whether the PDFs were attached.
export async function sendNextPart(o: Order, i: number) {
  const fr = o.lang === "fr", part = o.parts?.[i] ?? o.program, p = programs[o.lang][part];
  const date = o.starts?.[i] ? dayLabel(o.starts[i], o.lang) : "";
  const files = await programFiles({ ...o, debut: undefined }, part);
  const hello = fr ? `Bonjour ${o.firstName},` : `Hi ${o.firstName},`;
  const lines = fr
    ? [`La suite de ta Saison complète arrive : ta ${p.name} commence le ${date}.`, files ? "Ton programme est joint à cet email, avec les mêmes objectifs et le même lieu d'entraînement." : "Ton programme t'est envoyé à cette adresse sous 48 heures, avec les mêmes objectifs et le même lieu d'entraînement.", "Tes animations restent dans ton espace client, avec ta référence de commande."]
    : [`The next part of your Full season is here: your ${p.name} starts on ${date}.`, files ? "Your program is attached to this email, with the same goals and the same training place." : "Your program will be sent to this address within 48 hours, with the same goals and the same training place.", "Your animations are still in your customer area, with your order reference."];
  const lib = `${SITE}/${o.lang}/espace-client`;
  const html = frame(`<p>${esc(hello)}</p>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}${button(lib, fr ? "Ouvrir mon espace client" : "Open my customer area")}`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: o.email, replyTo: owner.email, subject: fr ? `Ta ${p.name} commence le ${date}` : `Your ${p.name} starts on ${date}`, html, text: [hello, "", ...lines, "", lib].join("\n"), attachments: files ?? undefined });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
  if (!files) {
    const todo = [`Saison complète : la ${programs.fr[part].name} commence le ${dayLabel(o.starts?.[i] ?? 0, "fr")}.`, `À FAIRE : envoyer ses PDF sous 48 heures (répondre au client à cette adresse). Le client a été prévenu.`, "", `Objectifs : ${goalsTitle(o.goals, "fr")}`, `Lieu : ${buy.fr.places[o.lieu][0]}`, `Langue du programme : ${o.plang === "en" ? "ANGLAIS" : "français"}`, `Option course : ${o.running ? "oui" : "non"}`, `Prénom : ${o.firstName}`, `Genre : ${o.gender}`, `Email : ${o.email}`, `Référence : ${o.id.slice(-12)}`];
    const n = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: MAIL_FROM(), replyTo: o.email, subject: `Partie suivante à envoyer : ${o.firstName}, ${programs.fr[part].name}`, text: todo.join("\n") });
    if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(n.message));
  }
  return !!files;
}

// Abandoned cart (app/api/cron): a single reminder, only to buyers who accepted offers by email on
// the payment page. The link recreates the same order.
export async function sendCartReminder(o: { email: string; lang: Lang; firstName: string; what: string; total: number }, link: string) {
  const fr = o.lang === "fr";
  const hello = fr ? `Bonjour${o.firstName ? ` ${o.firstName}` : ""},` : `Hi${o.firstName ? ` ${o.firstName}` : ""},`;
  const lines = fr
    ? [`Tu as commencé ta commande sans la terminer : ${o.what}, pour ${fmtPrice(o.total, "fr")}.`, "Ton choix est gardé : le bouton ci-dessous te ramène au paiement, avec les mêmes objectifs et les mêmes options.", "Une question avant de te lancer (objectifs, niveau, matériel) ? Réponds simplement à cet email, je te réponds sous 48 heures.", "C'est le seul rappel que tu recevras pour cette commande."]
    : [`You started your order without finishing it: ${o.what}, for ${fmtPrice(o.total, "en")}.`, "Your choices are saved: the button below takes you back to payment, with the same goals and options.", "A question before you start (goals, level, equipment)? Just reply to this email, I'll answer within 48 hours.", "This is the only reminder you'll get for this order."];
  const cta = fr ? "Reprendre ma commande" : "Resume my order";
  const html = frame(`<p>${esc(hello)}</p>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}${button(link, cta)}<p style="font-size:12px;color:#5B5673">${fr ? "Tu reçois cet email parce que tu as accepté de recevoir des offres par email sur la page de paiement." : "You are receiving this email because you agreed to receive offers by email on the payment page."}</p>`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: o.email, replyTo: owner.email, subject: fr ? "Ton programme t'attend" : "Your program is waiting", html, text: [hello, "", ...lines, "", `${cta} : ${link}`].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Message from the Contact page form (app/api/contact), to 6M Lab; replying answers the customer.
export type ContactMessage = { email: string; topic: string; ref: string; message: string; lang: Lang; src: string };
export async function sendContact(m: ContactMessage) {
  const lines = [`De : ${m.email}`, `Sujet : ${m.topic}`, `Référence de commande : ${m.ref || "non indiquée"}`, `Langue : ${m.lang}`, `Origine de la visite : ${m.src}`, "", m.message, "", `À faire : répondre sous ${REPLY_HOURS} heures (répondre à cet email écrit directement au client). Les réponses types sont dans l'admin > Réponses types. Un accusé de réception lui est déjà parti.`];
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: MAIL_FROM(), replyTo: m.email, subject: `Contact : ${m.topic}${m.ref ? ` (commande ${m.ref})` : ""}`, text: lines.join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Acknowledgement sent right away to whoever writes (Contact form or Clubs quote): the message is
// received, the answer comes within REPLY_HOURS, and the links that often answer first. Their
// message is copied at the bottom, so they know what was sent.
export async function sendAck(to: string, lang: Lang, kind: "contact" | "club", message: string) {
  const fr = lang === "fr";
  const hello = fr ? "Bonjour," : "Hi,";
  const l1 = kind === "club"
    ? fr ? "Ta demande de devis pour ton équipe est bien arrivée. Je l'étudie et je te réponds avec une proposition" : "Your quote request for your team has arrived. I'm looking at it and will reply with a proposal"
    : fr ? "Ton message est bien arrivé. Je te réponds personnellement" : "Your message has arrived. I'll reply to you personally";
  const when = fr ? `sous ${REPLY_HOURS} heures.` : `within ${REPLY_HOURS} hours.`;
  const l2 = fr ? "En attendant, la réponse est peut-être déjà ici :" : "In the meantime, the answer may already be here:";
  const links: [string, string][] = kind === "club"
    ? [[fr ? "La page Clubs : séance type, ce qu'il faut savoir" : "The Clubs page: sample session, what to know", `${SITE}/${lang}/clubs`], [fr ? "Les questions fréquentes" : "Frequent questions", `${SITE}/${lang}/faq`]]
    : [[fr ? "Ton espace client : animations, parrainage, points" : "Your customer area: animations, referral, points", `${SITE}/${lang}/espace-client`], [fr ? "Les questions fréquentes : commande, accès, remboursement" : "Frequent questions: order, access, refund", `${SITE}/${lang}/faq`]];
  const l3 = fr ? "Pour ajouter une précision, réponds simplement à cet email." : "To add anything, just reply to this email.";
  const copy = fr ? "Ton message :" : "Your message:";
  const html = frame(`<p>${hello}</p><p>${l1} <strong>${when}</strong></p><p>${l2}</p><ul>${links.map(([t, u]) => `<li style="margin:0 0 8px"><a href="${u}" style="color:#C4452A;font-weight:700">${esc(t)}</a></li>`).join("")}</ul><p>${l3}</p>${message ? `<div style="border-left:4px solid #E3E0F0;padding:2px 0 2px 14px;margin:20px 0;color:#5B5673"><p style="margin:0 0 6px;font-weight:700">${copy}</p><p style="margin:0;white-space:pre-wrap">${esc(message)}</p></div>` : ""}<p>6M Lab</p>`);
  const text = [hello, "", `${l1} ${when}`, "", l2, ...links.map(([t, u]) => `- ${t} : ${u}`), "", l3, ...(message ? ["", copy, message] : []), "", "6M Lab"].join("\n");
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to, replyTo: owner.email, subject: kind === "club" ? (fr ? "Ta demande de devis est bien arrivée" : "Your quote request has arrived") : fr ? "Ton message est bien arrivé" : "Your message has arrived", html, text });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Quote request from the Clubs page (app/api/clubs), to 6M Lab; replying answers the coach.
export async function sendClubRequest(r: { name: string; role: string; club: string; email: string; field: string; gk: string; side: string; category: string; level: string; acquis?: boolean; period: string; message: string; src: string; lang: Lang }, eq: { places: string[]; gear: string[]; other: string } = { places: [], gear: [], other: "" }) {
  const list = (l: string[]) => (l.length ? l.map((x) => `- ${x}`) : ["- rien de coché"]);
  const lines = [`Nom : ${r.name}`, `Rôle : ${r.role}`, `Club : ${r.club}`, `Email : ${r.email}`, `Joueurs de champ : ${r.field}`, `Gardiens : ${r.gk}`, `Filière : ${r.side}`, `Catégorie : ${r.category}`, ...(r.level ? [`Niveau : ${r.level}`, `Acquis attendus : ${r.acquis ? "confirmés par le coach" : "non confirmés"}`] : []), `Période : ${r.period}`, `Langue : ${r.lang}`, `Origine de la visite : ${r.src}`, "", "Installations :", ...list(eq.places), "", "Matériel :", ...list(eq.gear), ...(eq.other ? [`- Autre : ${eq.other}`] : []), "", r.message || "(pas de message)", "", "À faire : répondre sous 48 heures avec un devis (répondre à cet email écrit directement au club)."];
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: MAIL_FROM(), replyTo: r.email, subject: `Demande club : ${r.club}, ${r.category} ${r.side.toLowerCase()} (${r.field} joueurs de champ + ${r.gk} gardien${+r.gk > 1 ? "s" : ""})`, text: lines.join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Email at a key moment of the season (lib/season-mail.ts), to a free-session subscriber.
export async function sendSeasonMail(to: string, lang: Lang, c: Campaign, unsub: string) {
  const t = c[lang];
  await leadMail(to, lang, unsub, t.s, t.p, [t.c, `${SITE}/${lang}${c.path}`]);
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

// Referral: to the sponsor, once a teammate's order counted (lib/referral.ts): their points, and
// their thank-you code when they reach POINTS_FOR_REWARD.
export async function sendReferralPoints(r: PointsNews) {
  const fr = r.lang === "fr";
  const hello = fr ? `Bonjour ${r.firstName},` : `Hi ${r.firstName},`;
  const who = r.friend || (fr ? "Un coéquipier" : "A teammate");
  const l1 = fr ? `${who} a commandé son programme 6M Lab avec ton code de parrainage : +${POINTS_PER_FRIEND} points. Merci !` : `${who} ordered a 6M Lab program with your referral code: +${POINTS_PER_FRIEND} points. Thank you!`;
  const l2 = r.code
    ? fr ? `Tu as atteint ${POINTS_FOR_REWARD} points : voici ton code de -${SPONSOR_PERCENT} % sur ton prochain programme, valable un an, à saisir au moment du paiement :` : `You reached ${POINTS_FOR_REWARD} points: here is your ${SPONSOR_PERCENT}% discount code for your next program, valid for one year, to enter at checkout:`
    : fr ? `Tu as ${r.points} points sur ${POINTS_FOR_REWARD}. Encore ${Math.ceil((POINTS_FOR_REWARD - r.points) / POINTS_PER_FRIEND)} coéquipier(s) et tu reçois ton code de -${SPONSOR_PERCENT} % sur ton prochain programme.` : `You have ${r.points} points out of ${POINTS_FOR_REWARD}. ${Math.ceil((POINTS_FOR_REWARD - r.points) / POINTS_PER_FRIEND)} more teammate(s) and you get your ${SPONSOR_PERCENT}% discount code for your next program.`;
  const l3 = r.code ? (fr ? `Ton compteur repart à ${r.points} points pour le prochain code.` : `Your counter starts again at ${r.points} points for the next code.`) : "";
  const html = frame(`<p>${esc(hello)}</p><p>${esc(l1)}</p><p>${esc(l2)}</p>${r.code ? `<p style="font:700 22px Arial;letter-spacing:2px;background:#F5EDF0;border-radius:10px;padding:14px;text-align:center">${esc(r.code)}</p><p>${esc(l3)}</p>` : ""}${button(`${SITE}/${r.lang}/programmes`, fr ? "Voir les programmes" : "See the programs")}`);
  const subject = r.code ? (fr ? `Parrainage : ton code de -${SPONSOR_PERCENT} %` : `Referral: your ${SPONSOR_PERCENT}% discount code`) : fr ? `Parrainage : +${POINTS_PER_FRIEND} points (${r.points}/${POINTS_FOR_REWARD})` : `Referral: +${POINTS_PER_FRIEND} points (${r.points}/${POINTS_FOR_REWARD})`;
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to: r.email, replyTo: owner.email, subject, html, text: [hello, "", l1, l2, ...(r.code ? [r.code, "", l3] : [])].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
}

// Customer area login (lib/client-auth.ts): the 6-digit code. Written like the other emails of
// the site (greeting, full sentences, no digits at the start of the subject): iCloud's spam filter
// silently drops short emails that look like a bare code. Returns the mail server's answer, kept in
// the admin's login log.
export async function sendLoginCode(to: string, lang: Lang, code: string, minutes: number, firstName = ""): Promise<string> {
  const fr = lang === "fr";
  const hello = fr ? `Bonjour${firstName ? ` ${firstName}` : ""},` : `Hi${firstName ? ` ${firstName}` : ""},`;
  const l1 = fr ? "Tu as demandé à entrer dans ton espace client 6M Lab, où tu retrouves tes commandes, ta bibliothèque d'exercices et ton parrainage. Voici ton code de connexion :" : "You asked to enter your 6M Lab customer area, where you find your orders, your exercise library and your referral. Here is your login code:";
  const l2 = fr ? `Saisis-le sur la page de connexion. Il est valable ${minutes} minutes et ne sert qu'une fois.` : `Enter it on the login page. It is valid for ${minutes} minutes and works only once.`;
  const l3 = fr ? "Tu n'as rien demandé ? Ignore simplement cet email : personne ne peut entrer dans ton espace sans ce code." : "You did not ask for it? Just ignore this email: nobody can enter your area without this code.";
  const html = frame(`<p>${esc(hello)}</p><p>${esc(l1)}</p><p style="font:700 30px Arial;letter-spacing:8px;background:#F5EDF0;border-radius:10px;padding:16px;text-align:center">${code}</p><p>${esc(l2)}</p><p style="color:#5B5673;font-size:13px">${esc(l3)}</p>`);
  const info = await transport().sendMail({ from: `6M Lab <${MAIL_FROM()}>`, to, replyTo: owner.email, subject: fr ? "Ton code de connexion 6M Lab" : "Your 6M Lab login code", html, text: [hello, "", l1, "", code, "", l2, "", l3].join("\n") });
  if (process.env.MAIL_DRY_RUN === "1") console.log("[mail]", String(info.message));
  return String(info.response ?? "envoyé").slice(0, 120);
}

// "What's next" box of the end-of-program emails (lib/next-step.ts).
function nextBlock(n: NextStep, lang: Lang) {
  const href = nextHref(n, lang, true);
  return {
    html: `<div style="background:#F5F3FB;border-radius:10px;padding:14px 16px;margin:20px 0"><p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C4452A">${lang === "fr" ? "Et après ?" : "What's next?"}</p><p style="margin:0 0 6px;font-weight:700">${esc(n.t)}</p><p style="margin:0 0 10px">${esc(n.p)}</p><a href="${href}" style="color:#C4452A;font-weight:700">${esc(n.cta)} →</a></div>`,
    text: [lang === "fr" ? "Et après ?" : "What's next?", n.t, n.p, `${n.cta} : ${href}`],
  };
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
  const content = await readProgram(fr ? "seance-decouverte.pdf" : "en/seance-decouverte.pdf");
  if (!content) throw new Error("seance-decouverte.pdf introuvable");
  await leadMail(to, lang, unsub, fr ? "Ta séance gratuite 6M Lab" : "Your free 6M Lab session",
    fr
      ? ["Salut,", `Voici ta séance découverte en pièce jointe : 15 minutes de prévention des blessures pour le handball, sans matériel. Touche l'œil à côté de chaque exercice pour le voir en mouvement, ou retrouve les 8 animations sur <a href="${SITE}/fr/exercices/seance-gratuite">cette page</a>.`, "Fais-la 2 fois par semaine, en fin d'échauffement ou un jour sans handball. Dans les prochains jours, je t'envoie 3 conseils pour mieux te préparer.", "Raphaël, 6M Lab"]
      : ["Hi,", `Here is your free session, attached: 15 minutes of injury prevention for handball, no equipment. Tap the eye next to each exercise to see it in motion, or find all 8 animations on <a href="${SITE}/en/exercices/seance-gratuite">this page</a>.`, "Do it twice a week, at the end of your warm-up or on a day without handball. Over the next few days, I'll send you 3 tips to prepare better.", "Raphaël, 6M Lab"],
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
