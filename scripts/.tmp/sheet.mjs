import { animatedFigure, variants } from "/home/user/6mLab/programmes/source/figures.mjs";
import { chromium } from "playwright";
const ids = process.argv[2].split(",");
const T = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
let html = `<style>body{margin:0;font:12px sans-serif;background:#fff}.r{display:flex;align-items:center;border-bottom:1px solid #ddd}.r b{width:150px;padding:4px}svg{width:150px;height:150px}</style>`;
for (const spec of ids) { const [id, v] = spec.split(":"); for (const vv of v ? [v] : variants(id)) { const s = animatedFigure(id, vv); html += `<div class="r"><b>${id} ${vv}</b>` + T.map((t) => `<div data-t="${t}">${s}</div>`).join("") + `</div>`; } }
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1250, height: 400 } });
await p.setContent(html);
await p.evaluate(() => document.querySelectorAll("[data-t]").forEach((d) => { const s = d.querySelector("svg"); const dur = parseFloat(s.querySelector("animate").getAttribute("dur")); s.pauseAnimations(); s.setCurrentTime(dur * +d.dataset.t); }));
await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
