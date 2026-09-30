import { gzipSync } from "node:zlib";
import { redis, redisReady } from "@/lib/redis";
import { paidOrders, stripe } from "@/lib/feedback";

// Backup of the site's data, which is not in GitHub: Redis (club codes, statistics, login log,
// alerts…) and a copy of what Stripe keeps (orders with their metadata: access, referral, reviews;
// customers: free session and waiting lists). Sent every week by email (app/api/cron/backup) and
// downloadable from the admin home page (app/admin/sauvegarde). scripts/restaurer.mjs puts Redis
// back from such a file; Stripe itself stays the reference for orders and customers.
export type RedisEntry = { key: string; type: string; ttl: number; value: unknown };
export type Backup = { at: string; redis: RedisEntry[]; orders: unknown[]; customers: unknown[] };

// Keys that only live a few minutes or hours (attempt counters, 6-digit codes, alert dedupe) are
// left out: they would be expired before any restore.
const SHORT = 86400 * 1000;

async function redisDump(): Promise<RedisEntry[]> {
  if (!redisReady()) return [];
  const keys: string[] = [];
  let cursor = "0";
  do {
    const [res] = await redis([["SCAN", cursor, "COUNT", 500]]);
    const [next, batch] = res as [string, string[]];
    cursor = next;
    keys.push(...batch);
  } while (cursor !== "0" && keys.length < 100000);
  const out: RedisEntry[] = [];
  for (let i = 0; i < keys.length; i += 200) {
    const part = keys.slice(i, i + 200);
    const meta = await redis(part.flatMap((k) => [["TYPE", k], ["PTTL", k]]));
    const kept = part.map((key, j) => ({ key, type: String(meta[2 * j]), ttl: Number(meta[2 * j + 1]) })).filter((e) => e.type !== "none" && (e.ttl < 0 || e.ttl > SHORT));
    const read = (e: { key: string; type: string }): (string | number)[] =>
      e.type === "string" ? ["GET", e.key] : e.type === "set" ? ["SMEMBERS", e.key] : e.type === "list" ? ["LRANGE", e.key, 0, -1] : e.type === "hash" ? ["HGETALL", e.key] : ["ZRANGE", e.key, 0, -1, "WITHSCORES"];
    const values = kept.length ? await redis(kept.map(read)) : [];
    kept.forEach((e, j) => out.push({ ...e, value: values[j] }));
  }
  return out;
}

async function stripeDump() {
  const s = stripe();
  if (!s) return { orders: [], customers: [] };
  const orders = await paidOrders(s);
  const customers: unknown[] = [];
  for await (const c of s.customers.list({ limit: 100 })) {
    customers.push({ id: c.id, created: c.created, email: c.email, name: c.name, metadata: c.metadata });
    if (customers.length >= 20000) break;
  }
  return { orders, customers };
}

export async function makeBackup(): Promise<{ date: string; file: Buffer; summary: string[] }> {
  const at = new Date().toISOString();
  const [r, st] = await Promise.all([redisDump(), stripeDump()]);
  const data: Backup = { at, redis: r, ...st };
  const file = gzipSync(Buffer.from(JSON.stringify(data)));
  const summary = [
    `Base de données du site (Redis) : ${r.length} entrées, dont ${r.filter((e) => e.key.startsWith("club:")).length} codes clubs.`,
    `Stripe : ${st.orders.length} commandes et ${st.customers.length} clients (séance gratuite, listes d'attente).`,
    `Taille du fichier : ${Math.max(1, Math.round(file.length / 1024))} Ko.`,
  ];
  return { date: at.slice(0, 10), file, summary };
}
