import { figure } from "../../programmes/source/figures.mjs";
import { chromium } from "playwright";
let html = "<style>body{margin:0;background:#fff}svg{width:900px;height:600px}</style>";
for (const sex of ["n", "h", "f"]) html += figure(process.argv[2], undefined, sex);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 600 } });
await p.setContent(html); await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
