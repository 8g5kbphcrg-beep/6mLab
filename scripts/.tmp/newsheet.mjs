import { animatedFigure } from "../../programmes/source/figures.mjs";
import { chromium } from "playwright";
const cells = process.argv[2].split(","), T = [0, 0.25, 0.5];
let html = `<style>body{margin:0;font:12px sans-serif;background:#fff}.r{display:flex;align-items:center;border-bottom:1px solid #ddd}.r b{width:120px;padding:4px}svg{width:230px;height:230px}</style>`;
for (const c of cells) { const [id, v] = c.split(":"); html += `<div class="r"><b>${id} ${v}</b>` + T.map((t) => `<div data-t="${t}">${animatedFigure(id, v, { sex: process.argv[4] ?? "n" })}</div>`).join("") + `</div>`; }
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 850, height: 400 } });
await p.setContent(html);
await p.evaluate(() => document.querySelectorAll("[data-t]").forEach((d) => { const s = d.querySelector("svg"); const dur = parseFloat(s.querySelector("animate").getAttribute("dur")); s.pauseAnimations(); s.setCurrentTime(dur * +d.dataset.t); }));
await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
