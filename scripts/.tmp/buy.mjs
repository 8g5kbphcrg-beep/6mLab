import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 900 } });
await p.goto("http://localhost:3123/fr/programmes/pre-saison#acheter");
await p.locator(".bplaces").scrollIntoViewIfNeeded();
await p.locator(".bplace").nth(1).click();
const box = await p.locator(".bplaces").boundingBox();
await p.screenshot({ path: process.argv[2], clip: { x: 0, y: Math.max(0, box.y - 160), width: 420, height: 420 } });
await b.close();
