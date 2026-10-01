// Runs before every Vercel build (npm run build): copies the program PDFs (programmes/**/*.pdf)
// to the Vercel Blob store connected to the project, and writes lib/pdf-manifest.json, the list
// the site reads them from. The PDFs are too heavy to travel inside the sending function (250 MB
// limit), so they live in Blob and only an order's own files are fetched.
// Each file is stored under the hash of its content: a changed PDF gets a new path, an unchanged
// one is not sent again, and a preview build never overwrites what production uses.
// Without BLOB_READ_WRITE_TOKEN (on a computer), nothing happens: the site reads the PDFs from
// the folder.
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { list, put } from "@vercel/blob";

const root = join(import.meta.dirname, "..", "programmes");
const manifestPath = join(import.meta.dirname, "..", "lib", "pdf-manifest.json");
// How the build reaches the store connected to the project: a key BLOB_READ_WRITE_TOKEN (or
// <PREFIX>_READ_WRITE_TOKEN with a custom prefix), or, for the newer stores, BLOB_STORE_ID with the
// OIDC token Vercel gives the build (the Blob library finds it on its own).
const tokenName = Object.keys(process.env).find((k) => k === "BLOB_READ_WRITE_TOKEN") ?? Object.keys(process.env).find((k) => k.endsWith("_READ_WRITE_TOKEN"));
const token = tokenName ? process.env[tokenName] : undefined;
if (!token && !process.env.BLOB_STORE_ID) {
  // Names only (never values), to see what the connection added.
  const names = Object.keys(process.env).filter((k) => /BLOB|OIDC/.test(k)).join(", ") || "aucune";
  console.log(`[blob] pas d'accès au stockage (environnement ${process.env.VERCEL_ENV ?? "local"}, variables liées : ${names}) : PDF lus depuis le dossier programmes/`);
  process.exit(0);
}
console.log(`[blob] accès au stockage : ${tokenName ?? "BLOB_STORE_ID + OIDC"}`);

const files = [];
for (const e of await readdir(root, { recursive: true, withFileTypes: true })) {
  if (e.isFile() && e.name.endsWith(".pdf")) files.push(relative(root, join(e.parentPath ?? e.path, e.name)).split("\\").join("/"));
}
const existing = new Set();
let cursor;
do {
  const page = await list({ prefix: "programmes/", cursor, limit: 1000, ...(token ? { token } : {}) });
  for (const b of page.blobs) existing.add(b.pathname);
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

// The store is private or public, chosen when it was created: try private first.
let access = "private";
const send = async (pathname, body) => {
  try {
    await put(pathname, body, { access, contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true, ...(token ? { token } : {}) });
  } catch (e) {
    if (access !== "private") throw e;
    access = "public";
    await put(pathname, body, { access, contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true, ...(token ? { token } : {}) });
  }
};

const out = {};
let sent = 0;
const queue = [...files];
await Promise.all(Array.from({ length: 8 }, async () => {
  for (let f = queue.shift(); f; f = queue.shift()) {
    const body = await readFile(join(root, f));
    const pathname = `programmes/${createHash("sha256").update(body).digest("hex").slice(0, 20)}/${f}`;
    out[f] = pathname;
    if (!existing.has(pathname)) { await send(pathname, body); sent++; }
  }
}));
// The access is only known for sure after an upload; otherwise the site tries both.
await writeFile(manifestPath, JSON.stringify({ access: sent ? access : null, files: out }, null, 1) + "\n");
console.log(`[blob] ${files.length} PDF, ${sent} envoyés, accès ${access}`);
