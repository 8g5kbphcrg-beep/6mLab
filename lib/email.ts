import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import nodemailer from "nodemailer";
import type { Lang } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { goalOrder, goalsTitle, type GoalId } from "@/lib/goals";
import { fmtPrice } from "@/lib/checkout";
import { legalPaths, owner } from "@/lib/legal";
import { SITE } from "@/lib/dict";

export type Order = {
  id: string;
  email: string;
  lang: Lang;
  program: ProgramSlug;
  goals: GoalId[];
  running: boolean;
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
// for its pair of goals (in block order) and the running option. Returns null unless automatic
// sending is switched on (PROGRAMMES_ENVOI_AUTO=1, once the programs are validated) and every
// file exists, so a customer never gets a draft or half a program.
// True when the PDFs go out automatically with the confirmation (every combination except
// réathlétisation, whose program is not written yet).
export const deliversNow = (goals: string[]) => process.env.PROGRAMMES_ENVOI_AUTO === "1" && !goals.includes("reathletisation");

export async function programFiles(o: Order) {
  if (!deliversNow(o.goals)) return null;
  const goals = [...o.goals].sort((a, b) => goalOrder.indexOf(a) - goalOrder.indexOf(b));
  const names = [`guide-${o.program}.pdf`, `seances-${o.program}-${goals.join("-")}.pdf`, ...(o.running ? ["option-course.pdf"] : [])];
  const paths = names.map((n) => join(process.cwd(), "programmes", n));
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
    [fr ? "Programme" : "Program", `${p.name} (${p.duration})`],
    [fr ? "Objectifs" : "Goals", goalsTitle(o.goals, o.lang)],
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
  <div style="background:#100A24;padding:16px 20px;border-radius:12px 12px 0 0"><img src="${SITE}/brand/logo-email.png" width="189" height="56" alt="6M Lab · Be ready." style="display:block;border:0;color:#FFE14A;font:700 22px Arial"></div>
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
