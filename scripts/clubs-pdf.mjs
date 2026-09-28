// Builds the 4 PDFs of a club program from its document (an HTML file like
// private/docs/exemple-club-u18.html, with its 4 tabs), into private/clubs/<dossier>/:
//   1-document-coach.pdf, 2-autonomie-joueurs.pdf, 3-autonomie-gardiens.pdf, 4-fiche-de-suivi.pdf
// The eye of each exercise is a link to the club library on the site (clickable in the PDF), the
// team's club code (Admin > Clubs) replaces CLUB-____-____, and the follow-up sheet gets one line
// per player of the quote. Notes meant only for 6M Lab (class note6m) are left out.
// They are then downloaded from Admin > Clubs > Programmes clubs en PDF.
// Usage: npm run clubs-pdf -- --doc private/docs/exemple-club-u18.html --dossier exemple-u18
//          [--code CLUB-XXXX-XXXX] [--titre "HBC Exemple · U18 garçons"] [--champ 14] [--gardiens 2]
//          [--site https://…]   (default: NEXT_PUBLIC_SITE_URL, else https://6mlab.com)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const doc = arg("doc", "private/docs/exemple-club-u18.html");
const folder = arg("dossier", "exemple-u18").replace(/[^a-z0-9-]/g, "");
const code = arg("code", "");
const title = arg("titre", "");
const players = Number(arg("champ", "14")), keepers = Number(arg("gardiens", "2"));
const site = (arg("site", process.env.NEXT_PUBLIC_SITE_URL || "https://6mlab.com")).replace(/\/$/, "");

const DOCS = [
  ["d-coach", "1-document-coach", "Document du coach"],
  ["d-j", "2-autonomie-joueurs", "Autonomie · joueurs"],
  ["d-g", "3-autonomie-gardiens", "Autonomie · gardiens"],
  ["d-s", "4-fiche-de-suivi", "Fiche de suivi"],
];

// Print layout: only the document being printed, without the tabs, the window of the page, the
// admin link and the notes for 6M Lab; tables kept whole where possible.
const PRINT = `
html, body { background: #fff !important; }
.tabs, #modal, footer, .note6m, .top .kick, .top p { display: none !important; }
.doc[hidden] { display: none !important; }
.tw { overflow: visible !important; }
thead, th, .tabs, .top { position: static !important; }
thead { display: table-header-group; }
tr, .box, .warn, .drill, .card { break-inside: avoid; }
h2, h3 { break-after: avoid; }
a.eye { text-decoration: none; }
`;

// Anton, Inter and IBM Plex Mono, fetched once and embedded so the PDF never depends on a web font
// loading (as in scripts/programmes.mjs).
async function fonts() {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500")).text();
  const faces = [...css.matchAll(/@font-face\s*{[^}]*font-family:\s*'([^']+)'[^}]*font-weight:\s*(\d+)[^}]*src:\s*url\(([^)]+)\)[^}]*}/g)];
  const res = [];
  for (const [, family, weight, url] of faces) {
    const b64 = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    res.push(`@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${b64})}`);
  }
  return res.join("");
}

const out = join("private", "clubs", folder);
await mkdir(out, { recursive: true });
// The web font link of the document is dropped: the fonts are embedded instead.
const body = (await readFile(doc, "utf8")).replaceAll("__SITE__", site).replace(/<link[^>]+fonts\.g[^>]+>/g, "");
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${await fonts()}[hidden]{display:none!important}</style></head><body style="margin:0">${body}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts?.ready);
await page.addStyleTag({ content: PRINT });
// The team: title, club code and one line per player on the follow-up sheet.
await page.evaluate(({ code, title, players, keepers }) => {
  if (code) document.querySelectorAll(".clubcode").forEach((e) => { e.textContent = code; });
  if (title) { const h = document.querySelector(".top h1"); if (h) h.textContent = title; }
  const sheet = document.getElementById("sheet");
  // eslint-disable-next-line no-undef
  if (sheet && typeof sheetHTML === "function") sheet.innerHTML = sheetHTML(players + keepers, keepers);
}, { code, title, players, keepers });

const name = title || (await page.locator(".top h1").textContent())?.trim() || "Programme club";
for (const [id, file, label] of DOCS) {
  await page.evaluate((id) => document.querySelectorAll("main > .doc").forEach((d) => { d.hidden = d.id !== id; }), id);
  await page.pdf({
    path: join(out, `${file}.pdf`),
    format: "A4",
    landscape: id === "d-s",
    printBackground: true,
    margin: { top: "14mm", bottom: "16mm", left: "11mm", right: "11mm" },
    displayHeaderFooter: true,
    headerTemplate: `<div style="width:100%;font:8px Arial,sans-serif;color:#5B5673;padding:0 11mm;display:flex;justify-content:space-between"><span>6M Lab · ${name}</span><span>${label}</span></div>`,
    footerTemplate: `<div style="width:100%;font:8px Arial,sans-serif;color:#5B5673;padding:0 11mm;text-align:right"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
  });
  console.log("✓", join(out, `${file}.pdf`));
}
await writeFile(join(out, "infos.json"), JSON.stringify({ titre: name, code: code || null, champ: players, gardiens: keepers, site, date: new Date().toISOString().slice(0, 10) }, null, 2));
await browser.close();
