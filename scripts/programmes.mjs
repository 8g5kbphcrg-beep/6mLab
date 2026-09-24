// Builds the program PDFs sent by email: programmes/contenu/<name>.mjs -> programmes/<name>.pdf
// Usage: npm run programmes            (all)
//        npm run programmes -- base-pre-saison   (one)
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = join(import.meta.dirname, "..", "programmes");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
// **bold** inside text.
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const block = (b) => {
  if (b.h2) return `<h2>${md(b.h2)}</h2>`;
  if (b.h3) return `<h3>${md(b.h3)}</h3>`;
  if (b.p) return `<p>${md(b.p)}</p>`;
  if (b.ul) return `<ul>${b.ul.map((x) => `<li>${md(x)}</li>`).join("")}</ul>`;
  if (b.ol) return `<ol>${b.ol.map((x) => `<li>${md(x)}</li>`).join("")}</ol>`;
  if (b.note) return `<div class="note">${md(b.note)}</div>`;
  if (b.warn) return `<div class="note warn">${md(b.warn)}</div>`;
  if (b.table) return `<table><thead><tr>${b.table.head.map((h) => `<th>${md(h)}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  if (b.session) return `<div class="session"><div class="stitle">${md(b.session)}</div>${b.table ? "" : ""}<table><thead><tr><th>Exercice</th><th>Dosage</th><th>Repos</th></tr></thead><tbody>${b.rows.map((r) => `<tr><td>${md(r[0])}</td><td>${md(r[1])}</td><td>${md(r[2] ?? "")}</td></tr>`).join("")}</tbody></table></div>`;
  if (b.exercise) return `<div class="ex"><div class="exname">${md(b.exercise)}</div><p>${md(b.how)}</p>${b.cues ? `<p class="cues"><strong>Points clés :</strong> ${md(b.cues)}</p>` : ""}${b.easier ? `<p class="lvl"><strong>Plus facile :</strong> ${md(b.easier)}</p>` : ""}</div>`;
  if (b.pagebreak) return `<div class="pb"></div>`;
  throw new Error("Bloc inconnu : " + JSON.stringify(b));
};

// Anton and Inter, fetched once and embedded so the PDF never depends on a web font loading.
async function fonts() {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700")).text();
  const faces = [...css.matchAll(/@font-face\s*{[^}]*font-family:\s*'([^']+)'[^}]*font-weight:\s*(\d+)[^}]*src:\s*url\(([^)]+)\)[^}]*}/g)];
  const out = [];
  for (const [, family, weight, url] of faces) {
    const b64 = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    out.push(`@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${b64})}`);
  }
  return out.join("");
}

const LOGO_BALL = `<svg viewBox="0 0 100 100" width="44" height="44"><circle cx="50" cy="50" r="44" fill="none" stroke="#FF5A1F" stroke-width="7"/><path d="M18 32Q50 12 82 32M18 68Q50 88 82 68M12 50Q50 34 88 50" fill="none" stroke="#FF5A1F" stroke-width="6"/></svg>`;

const page = (d, fontCss) => `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>${fontCss}
@page{size:A4;margin:18mm 16mm 20mm}@page cover{margin:0}
*{box-sizing:border-box}body{font:10.5pt/1.55 Inter,sans-serif;color:#100A24;margin:0}
h1,h2,h3,.exname,.stitle{font-family:Anton,Impact,sans-serif;font-weight:400;letter-spacing:.01em}
.cover{page:cover;width:210mm;height:296mm;overflow:hidden;background:#100A24;color:#F3F1FB;padding:30mm 24mm 22mm;display:flex;flex-direction:column;page-break-after:always}
.cover .disc{margin-top:14mm;font-size:8.5pt;color:#9C93C9;max-width:150mm}
.logo{display:flex;align-items:flex-start;gap:4px}.logo b{font:400 64pt/1 Anton;color:#FFE14A;letter-spacing:-1px}.lab{font:700 11pt Inter;letter-spacing:.35em;color:#fff;opacity:.85;margin:6px 0 0 4px}
.cover .tag{display:inline-block;align-self:flex-start;background:${"var(--c)"};color:#100A24;font-weight:700;border-radius:99px;padding:4px 14px;margin-top:auto}
.cover h1{font-size:54pt;line-height:1;margin:14px 0 10px}.cover .sub{font-size:14pt;color:#CFC8EE;max-width:130mm}
.cover .meta{margin-top:18mm;display:flex;gap:10mm;font-size:10pt;color:#CFC8EE}.cover .meta strong{display:block;color:#fff;font-size:13pt}
.arc{margin-top:8mm}
h2{font-size:22pt;margin:0 0 4mm;padding-top:2mm;border-top:4px solid var(--c)}h2{page-break-after:avoid}
h3{font-size:14pt;margin:6mm 0 2mm;page-break-after:avoid}
p{margin:0 0 3mm}ul,ol{margin:0 0 3mm;padding-left:6mm}li{margin-bottom:1mm}
table{width:100%;border-collapse:collapse;margin:2mm 0 4mm;font-size:9.5pt;page-break-inside:avoid}
th{background:#100A24;color:#fff;text-align:left;padding:2mm 3mm;font-weight:600}td{padding:2mm 3mm;border-bottom:1px solid #E3E0F0;vertical-align:top}
tr:nth-child(even) td{background:#F6F5FB}
.note{background:#F6F5FB;border-left:4px solid var(--c);padding:3mm 4mm;margin:3mm 0 4mm;page-break-inside:avoid}.note.warn{border-left-color:#E32B2B;background:#FDF1F1}
.session{margin:3mm 0 5mm;page-break-inside:avoid}.stitle{font-size:13pt;margin-bottom:1mm}
.session th:first-child{width:52%}
.ex{border:1px solid #E3E0F0;border-left:4px solid var(--c);border-radius:3mm;padding:3mm 4mm;margin:0 0 3mm;page-break-inside:avoid}.exname{font-size:12.5pt;margin-bottom:1mm}
.ex p{margin:0 0 1.5mm}.cues,.lvl{font-size:9.5pt;color:#3A3452}
.pb{page-break-after:always}
</style></head><body style="--c:${d.color}">
<section class="cover">
  <div><div class="logo"><b>6M</b>${LOGO_BALL}</div><div class="lab">LAB</div></div>
  <span class="tag">${esc(d.tag)}</span>
  <h1>${esc(d.title)}</h1>
  <p class="sub">${esc(d.subtitle)}</p>
  <div class="meta">${d.meta.map(([k, v]) => `<div>${esc(k)}<strong>${esc(v)}</strong></div>`).join("")}</div>
  <svg class="arc" viewBox="0 0 220 30" width="300"><path d="M6 24Q110-6 214 24" fill="none" stroke="#FF5A1F" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 10"/></svg>
  <p class="disc">Document réservé à un usage personnel, ne pas diffuser. Programme destiné aux personnes en bonne santé : en cas de douleur, de blessure ou de doute, arrête et demande l'avis d'un professionnel de santé.</p>
</section>
${d.blocks.map(block).join("\n")}
</body></html>`;

const only = process.argv[2];
const files = (await readdir(join(root, "contenu"))).filter((f) => f.endsWith(".mjs") && (!only || f === `${only}.mjs`));
const fontCss = await fonts();
const browser = await chromium.launch();
const tab = await browser.newPage();
for (const f of files) {
  const d = (await import(pathToFileURL(join(root, "contenu", f)).href + `?t=${Date.now()}`)).default;
  await tab.setContent(page(d, fontCss));
  await tab.evaluate(() => document.fonts.ready);
  const pdf = await tab.pdf({
    format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="font:8px Arial;color:#8A84A3;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>6M Lab · ${esc(d.title)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  const out = join(root, f.replace(/\.mjs$/, ".pdf"));
  await writeFile(out, pdf);
  console.log("✓", out);
}
await browser.close();
