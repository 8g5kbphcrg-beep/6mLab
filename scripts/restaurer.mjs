// Puts the site's Redis data back from a backup (lib/backup.ts: the weekly email, or Admin >
// Sauvegarde). By default only the keys missing from Redis are written, so running it on a live
// base changes nothing that exists; --ecraser also replaces the keys that exist. Stripe is not
// touched: orders and customers are only in the file as a copy to read.
// Usage (with the Redis variables of the Vercel project in the environment):
//   KV_REST_API_URL=… KV_REST_API_TOKEN=… npm run restaurer -- 6mlab-sauvegarde-2026-10-05.json.gz [--ecraser]
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";

const file = process.argv[2];
const overwrite = process.argv.includes("--ecraser");
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!file || !url || !token) {
  console.error("Usage : KV_REST_API_URL=… KV_REST_API_TOKEN=… npm run restaurer -- fichier.json.gz [--ecraser]");
  process.exit(1);
}

const redis = async (cmds) => {
  const res = await fetch(`${url}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(cmds) });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return (await res.json()).map((r) => r.result ?? null);
};

const data = JSON.parse(gunzipSync(await readFile(file)).toString("utf8"));
console.log(`Sauvegarde du ${data.at} : ${data.redis.length} entrées Redis.`);

// The commands that rebuild one entry, then its expiry if it had one.
const write = ({ key, type, ttl, value }) => {
  const v = value ?? [];
  const cmds = [["DEL", key]];
  if (type === "string") cmds.push(["SET", key, v]);
  else if (type === "set" && v.length) cmds.push(["SADD", key, ...v]);
  else if (type === "list" && v.length) cmds.push(["RPUSH", key, ...v]);
  else if (type === "hash" && v.length) cmds.push(["HSET", key, ...v]);
  else if (type === "zset" && v.length) {
    const args = [];
    for (let i = 0; i < v.length; i += 2) args.push(v[i + 1], v[i]);
    cmds.push(["ZADD", key, ...args]);
  } else return [];
  if (ttl > 0) cmds.push(["PEXPIRE", key, ttl]);
  return cmds;
};

let written = 0, kept = 0;
for (let i = 0; i < data.redis.length; i += 100) {
  const part = data.redis.slice(i, i + 100);
  const exists = overwrite ? part.map(() => 0) : await redis(part.map((e) => ["EXISTS", e.key]));
  const todo = part.filter((_, j) => !exists[j]);
  kept += part.length - todo.length;
  const cmds = todo.flatMap(write);
  if (cmds.length) await redis(cmds);
  written += todo.length;
}
console.log(`✓ ${written} entrées écrites, ${kept} déjà présentes laissées telles quelles${overwrite ? "" : " (--ecraser pour les remplacer)"}.`);
