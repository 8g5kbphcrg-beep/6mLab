// Builds the 30-second product video (public/video/demo.mp4 and its first image demo.jpg): the real
// pages of the program PDF (public/apercu), the eye of an exercise, the real exercise animations,
// then what the customer gets. Vertical (720 × 1280), so it also fits Instagram and TikTok.
// Every frame is drawn at its exact time (no screen recording), then encoded in H.264 by ffmpeg.
// Usage: npm run demo-video -- --ffmpeg /path/to/ffmpeg   (any ffmpeg with libx264; default: "ffmpeg")
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { animatedFigure } from "../programmes/source/figures.mjs";
import { exercices } from "../programmes/source/exercices.mjs";
import { MARK_VIEWBOX, markSvg } from "../lib/mark.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const FFMPEG = arg("ffmpeg", "ffmpeg");
const FPS = 30, LENGTH = 30, W = 360, H = 640;

// The exercises shown, in the order of the session page: the eye touched is the one of
// "Saut latéral stabilisé" (row at 98 × 343 on the 620 × 878 page).
const ANIMS = [["skater-hop", 13, 16.5], ["pogos", 16.5, 20], ["nordic", 20, 23.2]];
const EYE = [101 / 620, 343 / 878];

async function fonts() {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@500;600;700")).text();
  const faces = [...css.matchAll(/@font-face\s*{[^}]*font-family:\s*'([^']+)'[^}]*font-weight:\s*(\d+)[^}]*src:\s*url\(([^)]+)\)[^}]*}/g)];
  const res = [];
  for (const [, family, weight, url] of faces) {
    const b64 = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    res.push(`@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${b64})}`);
  }
  return res.join("");
}
const img = async (f) => `data:image/jpeg;base64,${(await readFile(`public/apercu/${f}.jpg`)).toString("base64")}`;
const mark = (size) => `<svg viewBox="${MARK_VIEWBOX}" width="${size}" height="${size * 112 / 94}">${markSvg()}</svg>`;
const name = (id) => exercices[id]?.name ?? id;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${await fonts()}
*{box-sizing:border-box;margin:0}
body{width:${W}px;height:${H}px;overflow:hidden;background:#16123F;font-family:Inter,sans-serif}
#stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:linear-gradient(160deg,#16123F 0%,#3E1858 58%,#9E3456 100%)}
.layer{position:absolute;inset:0;opacity:0}
.center{display:grid;place-items:center;align-content:center;gap:18px;text-align:center;padding:0 28px}
h1{font:400 40px/1.02 Anton,Impact,sans-serif;color:#fff;text-transform:uppercase;letter-spacing:.01em}
.slogan{font:400 30px/1 'Bebas Neue',sans-serif;color:#FF7A59;letter-spacing:.3em}
#cap{position:absolute;left:24px;right:24px;top:44px;height:64px}
#cap p{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font:600 21px/1.25 Inter,sans-serif;color:#fff;opacity:0}
#phone{position:absolute;left:50%;top:128px;bottom:auto;right:auto;width:262px;margin-left:-131px;padding:9px;border-radius:28px;background:#0E0B26;box-shadow:0 22px 50px rgba(0,0,0,.45)}
.scr{position:relative;aspect-ratio:620/878;border-radius:18px;overflow:hidden;background:#fff}
.scr img,.zoom{position:absolute;inset:0;width:100%;height:100%;display:block}
.zoom{transform-origin:${EYE[0] * 100}% ${EYE[1] * 100}%}
#tap{position:absolute;left:${EYE[0] * 100}%;top:${EYE[1] * 100}%;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:3px solid #FF7A59;opacity:0}
#card{position:absolute;left:34px;right:34px;top:136px;bottom:auto;height:400px;border-radius:26px;background:#fff;box-shadow:0 22px 50px rgba(0,0,0,.4)}
.ex{position:absolute;inset:0;display:grid;grid-template-rows:1fr auto;padding:26px 20px 22px;opacity:0}
.ex svg{width:100%;height:100%}
.ex b{font:700 20px/1.2 Inter,sans-serif;color:#100A24;text-align:center}
#facts{padding:0 30px;display:grid;align-content:center;gap:22px}
#facts h2{font:400 34px/1.05 Anton,Impact,sans-serif;color:#fff;text-transform:uppercase;margin-bottom:6px}
.fact{display:flex;gap:14px;align-items:center;font:600 19px/1.3 Inter,sans-serif;color:#fff;opacity:0}
.fact i{flex:none;width:34px;height:34px;border-radius:50%;background:#FF7A59;color:#100A24;display:grid;place-items:center;font:700 17px Inter,sans-serif;font-style:normal}
.pill{display:inline-block;margin-top:8px;padding:14px 26px;border-radius:999px;background:#FF7A59;color:#100A24;font:700 18px Inter,sans-serif}
.brand{font:400 46px/1 Anton,Impact,sans-serif;color:#FFC75F;letter-spacing:.02em}
.small{font:500 15px/1.4 Inter,sans-serif;color:#E4DDF7}
</style></head><body><div id="stage">
<div class="layer center" id="s1">${mark(92)}<h1>Ta prépa physique handball</h1><p class="slogan">Be ready.</p></div>
<div id="cap">
  <p data-t="3.4,8.4">Ton programme en PDF</p>
  <p data-t="8.4,10.9">Chaque séance écrite en entier</p>
  <p data-t="10.9,13.1">Touche l'œil d'un exercice…</p>
  <p data-t="13.1,23.2">… et il s'anime</p>
</div>
<div class="layer" id="phone"><div class="scr">
  <img id="p1" src="${await img("f1-couverture")}" alt="">
  <img id="p2" src="${await img("f2-guide")}" alt="">
  <div class="zoom" id="p3"><img src="${await img("f3-seance")}" alt=""><span id="tap"></span></div>
</div></div>
<div class="layer" id="card">${ANIMS.map(([id]) => `<div class="ex" data-id="${id}">${animatedFigure(id, "poids")}<b>${name(id)}</b></div>`).join("")}</div>
<div class="layer" id="facts"><h2>Pensé pour le handball</h2>
  <p class="fact"><i>1</i>Des séances écrites en entier, semaine par semaine</p>
  <p class="fact"><i>2</i>À la maison ou en salle</p>
  <p class="fact"><i>3</i>Chaque exercice animé, sur ton téléphone</p>
</div>
<div class="layer center" id="end">${mark(70)}<p class="brand">6M LAB</p><p class="small">Pré-saison · Maintien · Saison complète</p><p class="pill">Choisir mon programme</p></div>
</div></body></html>`;

// Draws the frame at time t (seconds). Every value comes from t, so each frame is exact.
function render(t) {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const ease = (x) => { x = clamp(x); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
  const p = (a, b) => ease((t - a) / (b - a));
  // Visible between a and b, with fades of f seconds.
  const vis = (a, b, f = .4) => Math.min(p(a, a + f), 1 - p(b - f, b));
  const $ = (s) => document.querySelector(s);
  const set = (el, o, tr = "") => { el.style.opacity = String(o); el.style.transform = tr; };

  set($("#s1"), 1 - p(3, 3.5), `scale(${.92 + .08 * p(0, .8)})`);
  document.querySelectorAll("#cap p").forEach((e) => { const [a, b] = e.dataset.t.split(",").map(Number); set(e, vis(a, b, .35)); });

  set($("#phone"), vis(3.3, 13.3, .5), `translateY(${40 * (1 - p(3.3, 3.9))}px)`);
  set($("#p2"), t < 5.8 ? 0 : 1, `translateX(${100 * (1 - p(5.8, 6.3))}%)`);
  const zoom = 1 + 1.6 * p(9.1, 10.8);
  set($("#p3"), t < 8.3 ? 0 : 1, `translateX(${100 * (1 - p(8.3, 8.8))}%) scale(${zoom})`);
  const tap = clamp((t - 11.1) / .7);
  set($("#tap"), t > 11.1 && t < 12.6 ? 1 - tap * .6 : 0, `scale(${(1 + tap * 1.4) / zoom})`);

  set($("#card"), vis(13, 23.2, .45), `scale(${.9 + .1 * p(13, 13.5)})`);
  document.querySelectorAll(".ex").forEach((e, i) => {
    const [, a, b] = window.ANIMS[i];
    e.style.opacity = String(vis(a, b, .3));
    const svg = e.querySelector("svg");
    svg.pauseAnimations();
    svg.setCurrentTime(Math.max(0, t - a));
  });

  set($("#facts"), vis(23.3, 27.2, .4));
  document.querySelectorAll(".fact").forEach((e, i) => set(e, p(23.7 + i * .8, 24.2 + i * .8), `translateX(${-24 * (1 - p(23.7 + i * .8, 24.2 + i * .8))}px)`));
  set($("#end"), p(27.1, 27.6), `scale(${.94 + .06 * p(27.1, 27.9)})`);
}

await mkdir("public/video", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(async (a) => { window.ANIMS = a; await document.fonts.ready; }, ANIMS);
await page.evaluate(`window.render = ${render.toString()}`);

const ff = spawn(FFMPEG, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "27", "-movflags", "+faststart", "-an", "public/video/demo.mp4"], { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((ok, ko) => ff.on("close", (c) => (c === 0 ? ok() : ko(new Error(`ffmpeg ${c}`)))));
for (let i = 0; i < FPS * LENGTH; i++) {
  const t = i / FPS;
  await page.evaluate((t) => window.render(t), t);
  const png = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  // The image shown before the video plays: the session page with its eyes.
  if (i === 9 * FPS) await writeFile("public/video/demo.jpg", await page.screenshot({ type: "jpeg", quality: 82 }));
  if (i % (5 * FPS) === 0) console.log(`${t}s`);
}
ff.stdin.end();
await done;
await browser.close();
// A WebM copy (VP9) for the browsers that cannot read H.264 (some Linux browsers).
await new Promise((ok, ko) => spawn(FFMPEG, ["-y", "-loglevel", "error", "-i", "public/video/demo.mp4", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-an", "public/video/demo.webm"], { stdio: "inherit" })
  .on("close", (c) => (c === 0 ? ok() : ko(new Error(`ffmpeg webm ${c}`)))));
console.log("✓ public/video/demo.mp4, demo.webm, demo.jpg");
