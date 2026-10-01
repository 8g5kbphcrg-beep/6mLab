// Builds the program PDFs sent by email, from programmes/source/:
//   guide-<formule>-<lieu>.pdf        how the program works (explanations only)
//   seances-<formule>-<obj1>-<obj2>-<lieu>.pdf  every session written out in order + illustrated
//                                     exercises; <obj> alone with a single goal
//   seances-…-<lieu>-femme.pdf / -homme.pdf  the same with the silhouette chosen at checkout
//   option-course-<lieu>.pdf          the running option
// lieu: maison or salle, chosen at checkout (exercises, drawings and dosages from lieux.mjs).
//   seance-decouverte.pdf             the free 15-minute prevention session (sent from the home page)
// English: the same files in programmes/en/, texts from source/en.mjs (--en, or --fr for French only).
// Usage: npm run programmes            (all, French and English)
//        npm run programmes -- seances-pre-saison-explosivite-muscle-maison   (one, by file name)
//        npm run programmes -- --en seance-decouverte   (one, in English only)
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { exercices } from "../programmes/source/exercices.mjs";
import { objectifs, ordre, solos } from "../programmes/source/objectifs.mjs";
import { formules } from "../programmes/source/communs.mjs";
import optionCourse from "../programmes/source/option-course.mjs";
import { figure, variants } from "../programmes/source/figures.mjs";
import { LIEUX, doseFor, exoFor, precFor } from "../programmes/source/lieux.mjs";
import { MARK_VIEWBOX, markSvg, SLOGAN } from "../lib/mark.mjs";
import { EN } from "../programmes/source/en.mjs";
import { mkdir } from "node:fs/promises";

// Language of the document being built. T translates a French source text (unchanged in French);
// dosages built by lieux.mjs ("3-4 × 9-12 · descente en 3 s") are translated part by part.
let LANG = "fr";
const missing = new Set();
const PARTS = [[/(\d) à (\d)/g, "$1 to $2"], [/(^| )à (\d)/g, "$1at $2"], [/ par jambe/g, " per leg"], [/ par côté/g, " per side"], [/ par bras/g, " per arm"], [/descente en 3 s/g, "3 s descent"], [/pause 2 s en haut/g, "2 s pause at the top"], [/ passages/g, " runs"]];
const T = (s) => {
  if (LANG === "fr" || s == null || s === "" || !/[A-Za-zÀ-ÿ]/.test(s)) return s;
  if (EN[s] !== undefined) return EN[s];
  const parts = String(s).split(" · ").map((x) => EN[x] ?? PARTS.reduce((acc, [re, to]) => acc.replace(re, to), x));
  const out = parts.join(" · ");
  if (/[àâçéèêëîïôûùœ]|\b(par|avec|sans|descente|jambe|côté|séries?|haut|bas|les?|la|des?|du|en)\b|\bet\b(?! al)/i.test(out)) missing.add(s);
  return out;
};
// Fixed texts of the documents.
const UI = {
  fr: {
    seeAnim: "Voir l'animation",
    eyeNote: "<strong>Important : regarde l'animation de chaque exercice avant de le faire.</strong> Touche l'œil à côté de son nom. L'animation montre ce que le texte ne peut pas dire : le placement exact, le sens du mouvement, le rythme et les appuis. Ne te contente pas de lire le programme, surtout pour un exercice que tu ne connais pas : c'est ce qui rend chaque séance efficace et sans risque.",
    labels: { poids: "Au poids du corps", maison: "À la maison", elastique: "Avec un élastique", materiel: "Avec matériel", salle: "En salle" },
    band: "Avec un élastique :", cues: "Points clés :", easier: "Plus facile :", young: "Moins de 15 ans (filles) ou de 16 ans (garçons) :",
    disc: "Document réservé à un usage personnel, ne pas diffuser.",
    health: "Programme destiné aux personnes en bonne santé : en cas de douleur, de blessure ou de doute, arrête et demande l'avis d'un professionnel de santé.",
    guideTitle: (n) => `${n} : le guide`, guideSub: "Comment fonctionne ton programme : planning, déroulé des séances, progression et règles à connaître.",
    duration: "Durée", frequency: "Fréquence", session: "Séance", place: "Lieu", formula: "Formule",
    warmup: "Échauffement", core: "Gainage et prévention", cooldown: "Retour au calme", sessionK: (k) => `Séance ${k}`,
    bonusIntro: "Semaine après semaine, tu peux ajouter la séance bonus, facultative :", prevMob: "Prévention et mobilité",
    twoSessions: "Tes deux séances", placement: "<strong>Placement</strong> : la séance 1 au moins 3 jours avant le match, la séance 2 au plus tard 2 jours avant. Jamais la veille d'un match.",
    s1: "Séance 1 · la plus exigeante, loin du match", s2: "Séance 2 · plus légère",
    yourGoal: "Ton objectif", yourGoals: "Tes objectifs",
    soloIntro: "Tu as choisi un seul objectif : chaque séance lui consacre deux blocs, et l'accent change au fil des semaines. Ce que tu as travaillé avant reste dans les séances, avec moins de séries, pour ne pas le perdre.",
    golden: "Les règles d'or", howRead: "Comment lire tes séances",
    howReadList: ["Chaque séance est écrite en entier, dans l'ordre : fais les étapes de haut en bas.", "« 2-4 × 8 » : 2 séries au niveau 1, 3 au niveau 2, 4 au niveau 3, de 8 répétitions. « 2-3 × 8 » : 2 séries aux niveaux 1 et 2, 3 au niveau 3.", "Le numéro devant chaque exercice renvoie à sa fiche illustrée, à la fin de ce document.", "Si tu ne connais pas ton niveau, relis le guide, page « Choisir ton niveau »."],
    exercises: "Les exercices", exOrder: "Dans l'ordre des numéros utilisés dans tes séances.", exOrderFree: "Dans l'ordre des numéros de la séance.",
    sessionsTitle: "Tes séances",
  },
  en: {
    seeAnim: "See the animation",
    eyeNote: "<strong>Important: watch each exercise's animation before doing it.</strong> Tap the eye next to its name. The animation shows what the text cannot: the exact position, the direction of the movement, the rhythm and the footwork. Do not just read the program, especially for an exercise you do not know: this is what makes every session effective and safe.",
    labels: { poids: "Body weight", maison: "At home", elastique: "With a band", materiel: "With equipment", salle: "At the gym" },
    band: "With a band:", cues: "Key points:", easier: "Easier:", young: "Under 15 (girls) or 16 (boys):",
    disc: "For personal use only, do not share.",
    health: "This program is for people in good health: if you feel pain, have an injury or are in doubt, stop and ask a health professional for advice.",
    guideTitle: (n) => `${n}: the guide`, guideSub: "How your program works: schedule, how the sessions run, progression and the rules to know.",
    duration: "Duration", frequency: "Frequency", session: "Session", place: "Place", formula: "Program",
    warmup: "Warm-up", core: "Core and prevention", cooldown: "Cool-down", sessionK: (k) => `Session ${k}`,
    bonusIntro: "Week after week, you can add the optional bonus session:", prevMob: "Prevention and mobility",
    twoSessions: "Your two sessions", placement: "<strong>Timing</strong>: session 1 at least 3 days before the match, session 2 no later than 2 days before. Never the day before a match.",
    s1: "Session 1 · the more demanding one, far from the match", s2: "Session 2 · lighter",
    yourGoal: "Your goal", yourGoals: "Your goals",
    soloIntro: "You chose a single goal: every session gives it two blocks, and the focus changes over the weeks. What you worked on before stays in the sessions, with fewer sets, so you do not lose it.",
    golden: "The golden rules", howRead: "How to read your sessions",
    howReadList: ["Every session is written out in full, in order: do the steps from top to bottom.", "\"2-4 × 8\": 2 sets at level 1, 3 at level 2, 4 at level 3, of 8 reps. \"2-3 × 8\": 2 sets at levels 1 and 2, 3 at level 3.", "The number in front of each exercise refers to its illustrated sheet, at the end of this document.", "If you do not know your level, read the guide again, page \"Choosing your level\"."],
    exercises: "The exercises", exOrder: "In the order of the numbers used in your sessions.", exOrderFree: "In the order of the numbers in the session.",
    sessionsTitle: "Your sessions",
  },
};
const U = () => UI[LANG];

const out = join(import.meta.dirname, "..", "programmes");
// Website address used by the eye icons (animation of each exercise). The PDFs must be
// rebuilt if it changes (domain name).
const SITE = (process.env.PROGRAMMES_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://6m-lab-seven.vercel.app").replace(/\/$/, "");
const EYE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>`;
// Silhouettes of the figures: neutral (n), woman (f) or man (h), from the gender given at
// checkout, and their file name suffix.
const SEXES = { n: "", f: "-femme", h: "-homme" };
// A document is built for a place and a silhouette: ctx = { lieu, sex }.
const NEUTRAL = { lieu: "maison", sex: "n" };
// Eye icon linking to the exercise's animation (only for exercises that have one), in the same
// place and silhouette: /fr/exercices/<id>/<lieu>[-femme|-homme]. Exercises without one get an
// empty slot of the same width, so the names stay aligned.
const eye = (id, ctx = NEUTRAL) => (id && variants(id).length ? `<a class="eye" href="${SITE}/${LANG}/exercices/${id}/${ctx.lieu}${SEXES[ctx.sex]}" title="${U().seeAnim}">${EYE}</a>` : `<span class="eye none"></span>`);
// Shown at the start of the sessions and of the exercise sheets: the animations carry what the
// text cannot (placement, direction of the movement, rhythm), so they must be watched.
const EYE_NOTE = () => `<div class="eyenote"><span class="eye">${EYE}</span><div>${U().eyeNote}</div></div>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const md = (s) => esc(T(s)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

// Generic content blocks (guides, option course). A block with a lieu only appears in that
// place's documents.
const block = (b, lieu) => {
  if (b.lieu && b.lieu !== lieu) return "";
  if (b.h2) return `<h2>${md(b.h2)}</h2>`;
  if (b.h3) return `<h3>${md(b.h3)}</h3>`;
  if (b.p) return `<p>${md(b.p)}</p>`;
  if (b.ul) return `<ul>${b.ul.map((x) => `<li>${md(x)}</li>`).join("")}</ul>`;
  if (b.note) return `<div class="note">${md(b.note)}</div>`;
  if (b.warn) return `<div class="note warn">${md(b.warn)}</div>`;
  if (b.table) return `<table><thead><tr>${b.table.head.map((h) => `<th>${md(h)}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  if (b.exercise) return exerciseCard(null, { name: b.exercise, how: b.how, cues: b.cues, easier: b.easier });
  if (b.pagebreak) return `<div class="pb"></div>`;
  throw new Error("Bloc inconnu : " + JSON.stringify(b));
};

// An exercise card, as it is done in this place: its drawings (this place's version, then the
// band variant at home), labelled when there are several.

const exerciseCard = (n, base, id, ctx = NEUTRAL) => {
  const e = id ? exoFor(base, id, ctx.lieu) : base;
  const figs = e.figs ?? (id ? variants(id).map((v) => [id, v, U().labels[v]]) : []);
  const fig = figs.length ? `<div class="figs">${figs.map(([fid, v, lab]) => `<div class="fig">${figs.length > 1 ? `<span class="flab">${esc(LANG === "fr" ? lab : ({ "À la maison": U().labels.maison, "En salle": U().labels.salle, "Avec un élastique": U().labels.elastique }[lab] ?? T(lab)))}</span>` : ""}${figure(fid, v, ctx.sex)}</div>`).join("")}</div>` : "";
  return `<div class="ex${fig ? " hasfig" : ""}">${fig}<div class="extext"><div class="exname">${n ? `<span class="num">${n}</span>` : ""}${eye(id, ctx)}${md(e.name)}</div><p>${md(e.how)}</p>${e.band ? `<p class="lvl"><strong>${U().band}</strong> ${md(e.band)}</p>` : ""}${e.cues ? `<p class="cues"><strong>${U().cues}</strong> ${md(e.cues)}</p>` : ""}${e.easier ? `<p class="lvl"><strong>${U().easier}</strong> ${md(e.easier)}</p>` : ""}${e.jeune ? `<p class="lvl young"><strong>${U().young}</strong> ${md(e.jeune)}</p>` : ""}</div></div>`;
};

// A session: its steps, each a small table of exercises numbered from the library.
// Names, dosages and precisions follow the place (lieux.mjs).
const session = (title, steps, num, ctx = NEUTRAL) => `<section class="session"><div class="stitle">${md(title)}</div>${steps.map((st, i) => `
  <div class="step"><div class="sname"><span class="snum">${i + 1}</span>${md(st.name)}${st.duree ? `<span class="sdur">${esc(T(st.duree))}</span>` : ""}</div>
  ${st.text ? `<p class="stext">${md(st.text)}</p>` : `<table><tbody>${st.rows.map(([id, dose, rest, prec]) => `<tr><td class="c1"><span class="ref">${num(id)}</span>${eye(id, ctx)}${md(exoFor(exercices[id], id, ctx.lieu).name)}${precFor(id, prec, ctx.lieu) ? ` <span class="prec">(${md(precFor(id, prec, ctx.lieu))})</span>` : ""}</td><td class="c2">${md(doseFor(id, dose, ctx.lieu))}</td><td class="c3">${md(rest ?? "")}</td></tr>`).join("")}</tbody></table>`}</div>`).join("")}</section>`;

const css = (color) => `
@page{size:A4;margin:16mm 15mm 18mm}@page cover{margin:0}
*{box-sizing:border-box}body{font:10pt/1.5 Inter,sans-serif;color:#100A24;margin:0;--c:${color}}
h1,h2,h3,.exname,.stitle{font-family:Anton,Impact,sans-serif;font-weight:400;letter-spacing:.01em}
.cover{page:cover;width:210mm;height:296mm;overflow:hidden;background:linear-gradient(120deg,#16123F 0%,#3E1858 55%,#9E3456 100%);color:#F3F1FB;padding:30mm 24mm 22mm;display:flex;flex-direction:column;page-break-after:always}
.brand{display:inline-flex;flex-direction:column;align-items:center;gap:3mm;align-self:flex-start}.brand svg{height:34mm;width:auto}.brand b{font:400 17pt/1 "Bebas Neue";letter-spacing:.22em;margin-right:-.22em;color:#FFC75F;text-transform:uppercase}
.cover .tag{display:inline-block;align-self:flex-start;background:var(--c);color:#100A24;font-weight:700;border-radius:99px;padding:4px 14px;margin-top:auto}
.cover h1{font-size:48pt;line-height:1.02;margin:14px 0 10px}.cover .sub{font-size:14pt;color:#CFC8EE;max-width:140mm}
.cover .meta{margin-top:16mm;display:flex;gap:10mm;font-size:10pt;color:#CFC8EE}.cover .meta strong{display:block;color:#fff;font-size:13pt}
.cover .disc{margin-top:14mm;font-size:8.5pt;color:#9C93C9;max-width:150mm}
h2{font-size:21pt;margin:0 0 4mm;padding-top:2mm;border-top:4px solid var(--c);page-break-after:avoid}
h3{font-size:14pt;margin:6mm 0 2mm;page-break-after:avoid}
p{margin:0 0 3mm}ul{margin:0 0 3mm;padding-left:6mm}li{margin-bottom:1mm}
table{width:100%;border-collapse:collapse;margin:1mm 0 3mm;font-size:9.5pt;page-break-inside:avoid}
th{background:#100A24;color:#fff;text-align:left;padding:2mm 3mm;font-weight:600}td{padding:1.6mm 3mm;border-bottom:1px solid #E3E0F0;vertical-align:top}
tr:nth-child(even) td{background:#F6F5FB}
.eyenote{display:flex;gap:4mm;align-items:flex-start;background:#FFF1EC;border:2px solid var(--c);border-radius:3mm;padding:4mm 5mm;margin:0 0 5mm;page-break-inside:avoid;font-size:10.5pt}.eyenote .eye{width:12mm;height:8mm;flex:none;margin:0;border-radius:2mm}.eyenote .eye svg{width:6mm;height:6mm}
.note{background:#F6F5FB;border-left:4px solid var(--c);padding:3mm 4mm;margin:3mm 0 4mm;page-break-inside:avoid}.note.warn{border-left-color:#E32B2B;background:#FDF1F1}
.pb{page-break-after:always}
.goal{border:1px solid #E3E0F0;border-top:5px solid var(--gc);border-radius:3mm;padding:4mm 5mm;margin:0 0 5mm;page-break-inside:avoid}.goal h3{margin-top:0}
.phase{margin-top:2mm}.phase > p{color:#3A3452}
.session{border:1.5px solid #100A24;border-radius:3mm;padding:4mm 4mm 1mm;margin:0 0 6mm;page-break-inside:avoid}
.stitle{font-size:15pt;margin-bottom:2mm}
.step{margin-bottom:1.5mm}.sname{display:flex;align-items:center;gap:2mm;font-weight:700;font-size:9.5pt;text-transform:uppercase;letter-spacing:.04em;color:#3A3452}
.snum{display:inline-grid;place-items:center;width:5mm;height:5mm;border-radius:50%;background:var(--c);color:#100A24;font-size:8pt}
.sdur{margin-left:auto;font-weight:400;text-transform:none;letter-spacing:0;color:#5B5673}
.step table{margin:1mm 0 2mm}.step td{padding:1.3mm 2.5mm}.c1{width:56%}.c2{width:24%}.c3{color:#5B5673}.stext{font-size:9.5pt;color:#3A3452;margin:1mm 0 2mm}
.ref{display:inline-block;min-width:6mm;margin-right:2mm;padding:0 1.2mm;border-radius:2mm;background:#100A24;color:#fff;font-size:7.5pt;font-weight:700;text-align:center}
.prec{color:#5B5673}
.ex{border:1px solid #E3E0F0;border-left:4px solid var(--c);border-radius:3mm;padding:3mm 4mm;margin:0 0 3mm;page-break-inside:avoid;display:flex;gap:5mm;align-items:flex-start}
.ex.hasfig{flex-direction:column}.figs{display:flex;flex-wrap:wrap;gap:3mm;align-self:stretch}.fig{flex:1 1 28%;background:#F6F5FB;border-radius:2mm;padding:2mm 3mm;display:flex;flex-direction:column;align-items:center}.fig svg{height:40mm;width:auto;max-width:100%;display:block}.flab{align-self:flex-start;font-size:7.5pt;font-weight:700;background:#100A24;color:#fff;border-radius:99px;padding:0.3mm 2.5mm}
.exname{font-size:12.5pt;margin-bottom:1mm;display:flex;align-items:center;gap:2mm}.num{display:inline-grid;place-items:center;min-width:7mm;height:7mm;border-radius:2mm;background:#100A24;color:#fff;font:700 9pt Inter}
.eye{display:inline-flex;align-items:center;justify-content:center;width:7mm;height:4.2mm;margin-right:2mm;vertical-align:middle;color:#100A24;background:var(--c);border-radius:99px;text-decoration:none}.eye svg{width:3.6mm;height:3.6mm;display:block}.eye.none{background:none}
.exname .eye{width:9mm;height:7mm;border-radius:2mm;margin:0}.exname .eye svg{width:5mm;height:5mm}.exname .eye.none{display:none}
.ex p{margin:0 0 1.5mm}.cues,.lvl{font-size:9pt;color:#3A3452}
`;

const cover = (d) => `<section class="cover">
  <div class="brand"><svg viewBox="${MARK_VIEWBOX}">${markSvg()}</svg><b>${SLOGAN}</b></div>
  <span class="tag">${esc(T(d.tag))}</span><h1>${esc(T(d.title))}</h1><p class="sub">${esc(T(d.subtitle))}</p>
  <div class="meta">${d.meta.map(([k, v]) => `<div>${esc(T(k))}<strong>${esc(T(v))}</strong></div>`).join("")}</div>
  <p class="disc">${d.disc ?? U().disc} ${U().health}</p>
</section>`;

const page = (d, fontCss, body) => `<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><style>${fontCss}${css(d.color)}</style></head><body>${cover(d)}${body}</body></html>`;

// ---- Documents ----------------------------------------------------------------------------

const guideDoc = (fid, lieu) => {
  const f = formules[fid];
  const d = { title: U().guideTitle(T(f.name)), tag: f.tag, color: f.color, subtitle: U().guideSub, meta: [[U().duration, f.duree], [U().frequency, f.frequence], [U().session, f.seance]] };
  return { file: `guide-${fid}-${lieu}`, d: { ...d, meta: [...d.meta, [U().place, LIEUX[lieu].short]] }, body: f.guide.map((b) => block(b, lieu)).join("\n") };
};

// pair: two goals, or a single goal (its two blocks then come from solos). ctx: place and
// silhouette.
const seancesDoc = (fid, pair, ctx) => {
  const f = formules[fid];
  const gs = pair.map((g) => objectifs[g]);
  const solo = pair.length === 1 ? solos[pair[0]] : null;
  const title = gs.map((g) => T(g.name)).join(" + ");
  // Exercises are numbered in order of first appearance, so the library follows the sessions.
  const nums = new Map();
  const num = (id) => { if (!exercices[id]) throw new Error("Exercice inconnu : " + id); if (!nums.has(id)) nums.set(id, nums.size + 1); return nums.get(id); };
  const dur = (isPre) => (isPre ? "15-20 min" : "10-12 min");
  const goalSteps = (key, isPre) => solo
    ? (isPre ? solo.pre[isPre][key] : solo.maintien[key]).map((rows, i) => ({ name: `${T(gs[0].name)} · ${T(solo.names[isPre || "maintien"][i])}`, duree: dur(isPre), rows }))
    : gs.map((g) => ({ name: g.name, duree: dur(isPre), rows: isPre ? g.pre[isPre][key] : g.maintien[key] }));
  const steps = (key, gainage, isPre) => [
    { name: U().warmup, duree: isPre ? "10-12 min" : "8 min", rows: f.echauffement.rows },
    ...goalSteps(key, isPre),
    { name: U().core, duree: "5-8 min", rows: gainage },
    { name: U().cooldown, duree: "5 min", text: f.retourAuCalme },
  ];
  let sessions = "";
  if (fid === "pre-saison") {
    for (const ph of f.phases) {
      const notes = solo ? [solo.phaseNotes[ph.id]] : gs.map((g) => g.phaseNotes?.[ph.id]).filter(Boolean);
      sessions += `<div class="phase"><h2>${esc(T(ph.title))}</h2><p>${md(ph.texte)}</p>${notes.map((n) => `<div class="note">${md(n)}</div>`).join("")}`;
      for (const k of ["A", "B", "C"]) sessions += session(U().sessionK(k), steps(k, f.gainage[k], ph.id), num, ctx);
      if (ph.id === "bases") sessions += `<p class="stext">${U().bonusIntro}</p>` + session(f.bonus.title, [{ name: U().warmup, duree: "10 min", rows: f.echauffement.rows }, { name: U().prevMob, duree: "10 min", rows: f.bonus.rows }], num, ctx);
      sessions += `</div>`;
    }
    const aff = gs.map((g) => g.affutage && `<strong>${esc(T(g.name))}</strong>${LANG === "fr" ? " :" : ":"} ${md(g.affutage)}`).filter(Boolean);
    sessions += `<h2>${esc(T(f.affutage.title))}</h2><p>${md(f.affutage.texte)}</p>${aff.length ? `<ul>${aff.map((a) => `<li>${a}</li>`).join("")}</ul>` : ""}`;
  } else {
    sessions += `<h2>${U().twoSessions}</h2><p>${md(f.blocs)}</p><div class="note">${U().placement}</div>`;
    sessions += session(U().s1, steps("s1", f.gainage["1"], null), num, ctx);
    sessions += session(U().s2, steps("s2", f.gainage["2"], null), num, ctx);
  }
  const goals = `<h2>${solo ? U().yourGoal : U().yourGoals}</h2>${solo ? `<p>${U().soloIntro}</p>` : ""}${gs.map((g) => `<div class="goal" style="--gc:${g.color}"><h3>${esc(T(g.name))}</h3><p>${md(g.intro)}</p><ul>${g.qualites.map((q) => `<li>${md(q)}</li>`).join("")}</ul><p><strong>${U().golden}</strong></p><ul>${g.regles.map((q) => `<li>${md(q)}</li>`).join("")}</ul>${(g.notes ?? []).map((b) => block(b, ctx.lieu)).join("")}</div>`).join("")}
  ${EYE_NOTE()}
  <h2>${U().howRead}</h2><ul>${U().howReadList.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const library = `<div class="pb"></div><h2>${U().exercises}</h2><p>${U().exOrder}</p>${EYE_NOTE()}${[...nums].map(([id, n]) => exerciseCard(n, exercices[id], id, ctx)).join("")}`;
  const d = { title: U().sessionsTitle, tag: f.name, color: f.color, subtitle: title, meta: [[U().formula, f.name], [U().duration, f.duree], [U().session, f.seance], [U().place, LIEUX[ctx.lieu].short]] };
  return { file: `seances-${fid}-${pair.join("-")}-${ctx.lieu}${SEXES[ctx.sex]}`, d, body: goals + sessions + library };
};

const courseDoc = (lieu) => ({ file: `option-course-${lieu}`, d: optionCourse, body: optionCourse.blocks.map((b) => block(b, lieu)).join("\n") });

// The free session offered on the home page: 15 minutes of injury prevention, bodyweight only.
const FREE = {
  fr: {
    steps: [["Mise en route", "3 min"], ["Genoux et chevilles", "5 min"], ["Ischios et hanches", "4 min"], ["Tronc et épaules", "3 min"]],
    doses: { cheville: "10 par côté", hanche: "8 par côté", equilibre: "2 × 20 s par jambe", nordic: "descente courte si tu débutes", lateral: "2 × 20 s par côté", ytw: "6 de chaque lettre" },
    intro: `<h2>Ta séance découverte</h2>
  <p>15 minutes, sans matériel, pour protéger les zones qui lâchent le plus souvent au handball : genoux, chevilles, ischios et épaules. C'est un extrait du travail de prévention présent dans chaque séance des programmes 6M Lab.</p>
  <ul><li><strong>Quand ?</strong> 2 fois par semaine : en fin d'échauffement avant l'entraînement, ou un jour sans handball.</li>
  <li><strong>Comment ?</strong> Fais les étapes de haut en bas. « 2 × 10 » : 2 séries de 10 répétitions. La dernière colonne indique le repos entre les séries.</li>
  <li><strong>L'animation ?</strong> Touche l'œil à côté d'un exercice pour le voir en mouvement.</li></ul>
  <div class="note">La qualité avant tout : un geste propre et contrôlé protège, un geste bâclé ne sert à rien. En cas de douleur, arrête l'exercice.</div>`,
    after: (link) => `<h2>Et après ?</h2>
  <p>Cette séance entretient tes articulations. Pour progresser vraiment (explosivité, puissance, condition physique), il faut un programme construit semaine après semaine : c'est ce que proposent les programmes 6M Lab, avec une séance écrite en entier pour chaque jour et une animation pour chaque exercice.</p>
  <ul><li><strong>Pré-saison</strong> : 8 semaines pour reprendre fort, avant la reprise avec ton club.</li>
  <li><strong>Maintien en saison</strong> : 2 séances de 30 à 40 min par semaine pour garder ton niveau toute la saison.</li></ul>
  <p>Découvre-les sur ${link}.</p>`,
    session: "Séance prévention · 15 min",
    d: { disc: "Séance offerte par 6M Lab : tu peux la partager avec tes coéquipiers.", title: "Séance découverte", tag: "Offerte", subtitle: "15 minutes de prévention des blessures pour le handball, sans matériel.", meta: [["Durée", "15 min"], ["Matériel", "Aucun"], ["Fréquence", "2 fois par semaine"]] },
  },
  en: {
    steps: [["Getting going", "3 min"], ["Knees and ankles", "5 min"], ["Hamstrings and hips", "4 min"], ["Trunk and shoulders", "3 min"]],
    doses: { cheville: "10 per side", hanche: "8 per side", equilibre: "2 × 20 s per leg", nordic: "short descent if you are a beginner", lateral: "2 × 20 s per side", ytw: "6 of each letter" },
    intro: `<h2>Your free session</h2>
  <p>15 minutes, no equipment, to protect the areas that most often give way in handball: knees, ankles, hamstrings and shoulders. It is taken from the prevention work found in every session of the 6M Lab programs.</p>
  <ul><li><strong>When?</strong> Twice a week: at the end of your warm-up before practice, or on a day without handball.</li>
  <li><strong>How?</strong> Do the steps from top to bottom. "2 × 10": 2 sets of 10 reps. The last column gives the rest between sets.</li>
  <li><strong>The animation?</strong> Tap the eye next to an exercise to see it in motion.</li></ul>
  <div class="note">Quality above all: a clean, controlled movement protects you, a sloppy one is useless. If it hurts, stop the exercise.</div>`,
    after: (link) => `<h2>What next?</h2>
  <p>This session looks after your joints. To really progress (explosiveness, power, fitness), you need a program built week after week: that is what the 6M Lab programs offer, with every session written out in full and an animation for every exercise.</p>
  <ul><li><strong>Pre-season</strong>: 8 weeks to come back strong, before training restarts with your club.</li>
  <li><strong>In-season maintenance</strong>: 2 sessions of 30 to 40 min per week to keep your level all season.</li></ul>
  <p>Find them on ${link}.</p>`,
    session: "Prevention session · 15 min",
    d: { disc: "Free session from 6M Lab: feel free to share it with your teammates.", title: "Free session", tag: "Free", subtitle: "15 minutes of injury prevention for handball, no equipment.", meta: [["Duration", "15 min"], ["Equipment", "None"], ["Frequency", "Twice a week"]] },
  },
};
const decouverteDoc = () => {
  const F = FREE[LANG], ds = F.doses;
  const nums = new Map();
  const num = (id) => { if (!exercices[id]) throw new Error("Exercice inconnu : " + id); if (!nums.has(id)) nums.set(id, nums.size + 1); return nums.get(id); };
  const rows = [
    [["cheville-mur", ds.cheville, ""], ["ouverture-hanche", ds.hanche, ""]],
    [["equilibre", ds.equilibre, "15 s"], ["saut-reception", "2 × 5", "20 s"]],
    [["pont-fessier", "2 × 10", "15 s"], ["nordic", "2 × 3", "60 s", ds.nordic]],
    [["gainage-lateral", ds.lateral, "15 s"], ["ytw", ds.ytw, ""]],
  ];
  const steps = F.steps.map(([name, duree], i) => ({ name, duree, rows: rows[i] }));
  const link = `<a href="${SITE}/${LANG}/programmes">${esc(SITE.replace(/^https?:\/\//, ""))}</a>`;
  const body = F.intro + session(F.session, steps, num) + F.after(link)
    + `<div class="pb"></div><h2>${U().exercises}</h2><p>${U().exOrderFree}</p>${[...nums].map(([id, n]) => exerciseCard(n, exercices[id], id)).join("")}`;
  return { file: "seance-decouverte", d: { ...F.d, color: "#2EC4B6" }, body };
};

const pairs = [...ordre.map((a) => [a]), ...ordre.flatMap((a, i) => ordre.slice(i + 1).map((b) => [a, b]))];
const lieux = Object.keys(LIEUX);
const buildDocs = () => [
  ...Object.keys(formules).flatMap((fid) => lieux.map((lieu) => guideDoc(fid, lieu))),
  ...Object.keys(formules).flatMap((fid) => pairs.flatMap((p) => lieux.flatMap((lieu) => Object.keys(SEXES).map((sex) => seancesDoc(fid, p, { lieu, sex }))))),
  ...lieux.map(courseDoc),
  decouverteDoc(),
];

// Anton and Inter, fetched once and embedded so the PDF never depends on a web font loading.
async function fonts() {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;600;700")).text();
  const faces = [...css.matchAll(/@font-face\s*{[^}]*font-family:\s*'([^']+)'[^}]*font-weight:\s*(\d+)[^}]*src:\s*url\(([^)]+)\)[^}]*}/g)];
  const res = [];
  for (const [, family, weight, url] of faces) {
    const b64 = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    res.push(`@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${b64})}`);
  }
  return res.join("");
}

const args = process.argv.slice(2);
const langs = args.includes("--en") ? ["en"] : args.includes("--fr") ? ["fr"] : ["fr", "en"];
const only = args.find((x) => !x.startsWith("--"));
// Build every document first, in each language: a text missing from en.mjs stops everything
// before any PDF is written.
const todo = [];
for (const lang of langs) { LANG = lang; for (const doc of buildDocs()) if (!only || doc.file === only) todo.push({ lang, doc }); }
if (missing.size) { console.error(`Textes sans traduction dans programmes/source/en.mjs (${missing.size}) :\n` + [...missing].map((m) => "  " + JSON.stringify(m)).join("\n")); process.exit(1); }
const fontCss = await fonts();
const browser = await chromium.launch();
const tab = await browser.newPage();
for (const { lang, doc } of todo) {
  LANG = lang;
  const dir = lang === "fr" ? out : join(out, lang);
  await mkdir(dir, { recursive: true });
  await tab.setContent(page(doc.d, fontCss, doc.body));
  await tab.evaluate(() => document.fonts.ready);
  const pdf = await tab.pdf({
    format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="font:8px Arial;color:#8A84A3;width:100%;padding:0 15mm;display:flex;justify-content:space-between"><span>6M Lab · ${esc(T(doc.d.title))}${doc.d.subtitle && doc.file.startsWith("seances") ? " · " + esc(doc.d.subtitle) : ""}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  await writeFile(join(dir, `${doc.file}.pdf`), pdf);
  console.log("✓", lang, doc.file);
}
await browser.close();
