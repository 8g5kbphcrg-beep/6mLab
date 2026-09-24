// Builds the program PDFs sent by email, from programmes/source/:
//   guide-<formule>.pdf               how the program works (explanations only)
//   seances-<formule>-<obj1>-<obj2>.pdf  every session written out in order + illustrated exercises
//   option-course.pdf                 the running option
// Usage: npm run programmes            (all)
//        npm run programmes -- seances-pre-saison-explosivite-muscle   (one, by file name)
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { exercices } from "../programmes/source/exercices.mjs";
import { objectifs, ordre } from "../programmes/source/objectifs.mjs";
import { formules } from "../programmes/source/communs.mjs";
import optionCourse from "../programmes/source/option-course.mjs";
import { figure, variants } from "../programmes/source/figures.mjs";

const out = join(import.meta.dirname, "..", "programmes");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

// Generic content blocks (guides, option course).
const block = (b) => {
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

const exerciseCard = (n, e, id) => {
  // One drawing per version (bodyweight, with equipment), labelled when there are two.
  const vs = id ? variants(id) : [];
  const label = { poids: "Au poids du corps", materiel: "Avec matériel" };
  const fig = vs.length ? `<div class="figs">${vs.map((v) => `<div class="fig">${vs.length > 1 ? `<span class="flab">${label[v]}</span>` : ""}${figure(id, v)}</div>`).join("")}</div>` : "";
  return `<div class="ex${fig ? " hasfig" : ""}">${fig}<div class="extext"><div class="exname">${n ? `<span class="num">${n}</span>` : ""}${md(e.name)}</div><p>${md(e.how)}</p>${e.cues ? `<p class="cues"><strong>Points clés :</strong> ${md(e.cues)}</p>` : ""}${e.easier ? `<p class="lvl"><strong>Plus facile :</strong> ${md(e.easier)}</p>` : ""}</div></div>`;
};

// A session: its steps, each a small table of exercises numbered from the library.
const session = (title, steps, num) => `<section class="session"><div class="stitle">${md(title)}</div>${steps.map((st, i) => `
  <div class="step"><div class="sname"><span class="snum">${i + 1}</span>${md(st.name)}${st.duree ? `<span class="sdur">${esc(st.duree)}</span>` : ""}</div>
  ${st.text ? `<p class="stext">${md(st.text)}</p>` : `<table><tbody>${st.rows.map(([id, dose, rest, prec]) => `<tr><td class="c1"><span class="ref">${num(id)}</span>${md(exercices[id].name)}${prec ? ` <span class="prec">(${md(prec)})</span>` : ""}</td><td class="c2">${md(dose)}</td><td class="c3">${md(rest ?? "")}</td></tr>`).join("")}</tbody></table>`}</div>`).join("")}</section>`;

const css = (color) => `
@page{size:A4;margin:16mm 15mm 18mm}@page cover{margin:0}
*{box-sizing:border-box}body{font:10pt/1.5 Inter,sans-serif;color:#100A24;margin:0;--c:${color}}
h1,h2,h3,.exname,.stitle{font-family:Anton,Impact,sans-serif;font-weight:400;letter-spacing:.01em}
.cover{page:cover;width:210mm;height:296mm;overflow:hidden;background:#100A24;color:#F3F1FB;padding:30mm 24mm 22mm;display:flex;flex-direction:column;page-break-after:always}
.logo{display:flex;align-items:flex-start;gap:4px}.logo b{font:400 64pt/1 Anton;color:#FFE14A;letter-spacing:-1px}.lab{font:700 11pt Inter;letter-spacing:.35em;color:#fff;opacity:.85;margin:6px 0 0 4px}
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
.ex.hasfig{flex-direction:column}.figs{display:flex;gap:3mm;align-self:stretch}.fig{flex:1;background:#F6F5FB;border-radius:2mm;padding:2mm 3mm;display:flex;flex-direction:column;align-items:center}.fig svg{height:40mm;width:auto;max-width:100%;display:block}.flab{align-self:flex-start;font-size:7.5pt;font-weight:700;background:#100A24;color:#fff;border-radius:99px;padding:0.3mm 2.5mm}
.exname{font-size:12.5pt;margin-bottom:1mm;display:flex;align-items:center;gap:2mm}.num{display:inline-grid;place-items:center;min-width:7mm;height:7mm;border-radius:2mm;background:#100A24;color:#fff;font:700 9pt Inter}
.ex p{margin:0 0 1.5mm}.cues,.lvl{font-size:9pt;color:#3A3452}
`;

const LOGO_BALL = `<svg viewBox="0 0 100 100" width="44" height="44"><circle cx="50" cy="50" r="44" fill="none" stroke="#FF5A1F" stroke-width="7"/><path d="M18 32Q50 12 82 32M18 68Q50 88 82 68M12 50Q50 34 88 50" fill="none" stroke="#FF5A1F" stroke-width="6"/></svg>`;
const cover = (d) => `<section class="cover">
  <div><div class="logo"><b>6M</b>${LOGO_BALL}</div><div class="lab">LAB</div></div>
  <span class="tag">${esc(d.tag)}</span><h1>${esc(d.title)}</h1><p class="sub">${esc(d.subtitle)}</p>
  <div class="meta">${d.meta.map(([k, v]) => `<div>${esc(k)}<strong>${esc(v)}</strong></div>`).join("")}</div>
  <p class="disc">Document réservé à un usage personnel, ne pas diffuser. Programme destiné aux personnes en bonne santé : en cas de douleur, de blessure ou de doute, arrête et demande l'avis d'un professionnel de santé.</p>
</section>`;

const page = (d, fontCss, body) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${fontCss}${css(d.color)}</style></head><body>${cover(d)}${body}</body></html>`;

// ---- Documents ----------------------------------------------------------------------------

const guideDoc = (fid) => {
  const f = formules[fid];
  const d = { title: `${f.name} : le guide`, tag: f.tag, color: f.color, subtitle: "Comment fonctionne ton programme : planning, déroulé des séances, progression et règles à connaître.", meta: [["Durée", f.duree], ["Fréquence", f.frequence], ["Séance", f.seance]] };
  return { file: `guide-${fid}`, d, body: f.guide.map(block).join("\n") };
};

const seancesDoc = (fid, pair) => {
  const f = formules[fid];
  const [g1, g2] = pair.map((g) => objectifs[g]);
  const title = `${g1.name} + ${g2.name}`;
  // Exercises are numbered in order of first appearance, so the library follows the sessions.
  const nums = new Map();
  const num = (id) => { if (!exercices[id]) throw new Error("Exercice inconnu : " + id); if (!nums.has(id)) nums.set(id, nums.size + 1); return nums.get(id); };
  const steps = (key, gainage, isPre) => [
    { name: "Échauffement", duree: isPre ? "10-12 min" : "8 min", rows: f.echauffement.rows },
    { name: g1.name, duree: isPre ? "15-20 min" : "10-12 min", rows: isPre ? g1.pre[isPre][key] : g1.maintien[key] },
    { name: g2.name, duree: isPre ? "15-20 min" : "10-12 min", rows: isPre ? g2.pre[isPre][key] : g2.maintien[key] },
    { name: "Gainage et prévention", duree: "5-8 min", rows: gainage },
    { name: "Retour au calme", duree: "5 min", text: f.retourAuCalme },
  ];
  let sessions = "";
  if (fid === "pre-saison") {
    for (const ph of f.phases) {
      const notes = [g1, g2].map((g) => g.phaseNotes?.[ph.id]).filter(Boolean);
      sessions += `<div class="phase"><h2>${esc(ph.title)}</h2><p>${md(ph.texte)}</p>${notes.map((n) => `<div class="note">${md(n)}</div>`).join("")}`;
      for (const k of ["A", "B", "C"]) sessions += session(`Séance ${k}`, steps(k, f.gainage[k], ph.id), num);
      if (ph.id === "bases") sessions += `<p class="stext">Semaine après semaine, tu peux ajouter la séance bonus, facultative :</p>` + session(f.bonus.title, [{ name: "Échauffement", duree: "10 min", rows: f.echauffement.rows }, { name: "Prévention et mobilité", duree: "10 min", rows: f.bonus.rows }], num);
      sessions += `</div>`;
    }
    const aff = [g1, g2].map((g) => g.affutage && `**${g.name}** : ${g.affutage}`).filter(Boolean);
    sessions += `<h2>${esc(f.affutage.title)}</h2><p>${md(f.affutage.texte)}</p>${aff.length ? `<ul>${aff.map((a) => `<li>${md(a)}</li>`).join("")}</ul>` : ""}`;
  } else {
    sessions += `<h2>Tes deux séances</h2><p>${md(f.blocs)}</p><div class="note">**Placement** : la séance 1 au moins 3 jours avant le match, la séance 2 au plus tard 2 jours avant. Jamais la veille d'un match.</div>`.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    sessions += session("Séance 1 · la plus exigeante, loin du match", steps("s1", f.gainage["1"], null), num);
    sessions += session("Séance 2 · plus légère", steps("s2", f.gainage["2"], null), num);
  }
  const goals = `<h2>Tes objectifs</h2>${[g1, g2].map((g) => `<div class="goal" style="--gc:${g.color}"><h3>${esc(g.name)}</h3><p>${md(g.intro)}</p><ul>${g.qualites.map((q) => `<li>${md(q)}</li>`).join("")}</ul><p><strong>Les règles d'or</strong></p><ul>${g.regles.map((q) => `<li>${md(q)}</li>`).join("")}</ul>${(g.notes ?? []).map(block).join("")}</div>`).join("")}
  <h2>Comment lire tes séances</h2><ul>
  <li>Chaque séance est écrite en entier, dans l'ordre : fais les étapes de haut en bas.</li>
  <li>« 2-4 × 8 » : 2 séries au niveau 1, 3 au niveau 2, 4 au niveau 3, de 8 répétitions. « 2-3 × 8 » : 2 séries aux niveaux 1 et 2, 3 au niveau 3.</li>
  <li>Le numéro devant chaque exercice renvoie à sa fiche illustrée, à la fin de ce document.</li>
  <li>Si tu ne connais pas ton niveau, relis le guide, page « Choisir ton niveau ».</li></ul>`;
  const library = `<div class="pb"></div><h2>Les exercices</h2><p>Dans l'ordre des numéros utilisés dans tes séances.</p>${[...nums].map(([id, n]) => exerciseCard(n, exercices[id], id)).join("")}`;
  const d = { title: "Tes séances", tag: f.name, color: f.color, subtitle: title, meta: [["Formule", f.name], ["Durée", f.duree], ["Séance", f.seance]] };
  return { file: `seances-${fid}-${pair.join("-")}`, d, body: goals + sessions + library };
};

const courseDoc = () => ({ file: "option-course", d: optionCourse, body: optionCourse.blocks.map(block).join("\n") });

const pairs = ordre.flatMap((a, i) => ordre.slice(i + 1).map((b) => [a, b]));
const docs = [
  ...Object.keys(formules).map(guideDoc),
  ...Object.keys(formules).flatMap((fid) => pairs.map((p) => seancesDoc(fid, p))),
  courseDoc(),
];

// Anton and Inter, fetched once and embedded so the PDF never depends on a web font loading.
async function fonts() {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700")).text();
  const faces = [...css.matchAll(/@font-face\s*{[^}]*font-family:\s*'([^']+)'[^}]*font-weight:\s*(\d+)[^}]*src:\s*url\(([^)]+)\)[^}]*}/g)];
  const res = [];
  for (const [, family, weight, url] of faces) {
    const b64 = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    res.push(`@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${b64})}`);
  }
  return res.join("");
}

const only = process.argv[2];
const fontCss = await fonts();
const browser = await chromium.launch();
const tab = await browser.newPage();
for (const doc of docs.filter((x) => !only || x.file === only)) {
  await tab.setContent(page(doc.d, fontCss, doc.body));
  await tab.evaluate(() => document.fonts.ready);
  const pdf = await tab.pdf({
    format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="font:8px Arial;color:#8A84A3;width:100%;padding:0 15mm;display:flex;justify-content:space-between"><span>6M Lab · ${esc(doc.d.title)}${doc.d.subtitle && doc.file.startsWith("seances") ? " · " + esc(doc.d.subtitle) : ""}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  await writeFile(join(out, `${doc.file}.pdf`), pdf);
  console.log("✓", doc.file);
}
await browser.close();
