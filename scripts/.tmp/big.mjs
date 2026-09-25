import { animatedFigure, variants } from "../../programmes/source/figures.mjs";
import { chromium } from "playwright";
const ids = process.argv[2].split(","), T = (process.argv[4] ?? "0,0.25,0.5,0.75").split(",").map(Number);
let html = `<style>body{margin:0;font:13px sans-serif;background:#fff}.r{display:flex;align-items:center;border-bottom:1px solid #ddd}.r b{width:110px;padding:4px}svg{width:330px;height:330px}</style>`;
for (const spec of ids) { const [id, v] = spec.split(":"); for (const sex of ["f", "h", "n"]) { html += `<div class="r"><b>${id} ${sex}</b>` + T.map((t) => `<div data-t="${t}">${animatedFigure(id, v ?? variants(id)[0], { sex })}</div>`).join("") + `</div>`; } }
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 400 } });
await p.setContent(html);
await p.evaluate(() => document.querySelectorAll("[data-t]").forEach((d) => { const s = d.querySelector("svg"); const dur = parseFloat(s.querySelector("animate").getAttribute("dur")); s.pauseAnimations(); s.setCurrentTime(dur * +d.dataset.t); }));
await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
