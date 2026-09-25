import { animatedFigure } from "../../programmes/source/figures.mjs";
import * as old from "./old/programmes/source/figures.mjs";
import { writeFileSync } from "node:fs";
const cells = ["squat:poids", "skater-hop:poids", "fente-rotation:poids", "rowing:materiel", "gainage-lateral:poids", "pompes:poids"];
const out = { sexes: {}, fixes: {} };
for (const sex of ["f", "h", "n"]) out.sexes[sex] = cells.map((c) => { const [id, v] = c.split(":"); return animatedFigure(id, v, { sex }); });
for (const c of ["developpe-couche:materiel", "drop-jump:poids", "box-jump:poids", "copenhague:poids"]) { const [id, v] = c.split(":"); out.fixes[id] = [old.animatedFigure(id, v), animatedFigure(id, v, { sex: "n" })]; }
writeFileSync(process.argv[2], JSON.stringify(out));
