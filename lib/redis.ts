// Upstash Redis over its REST API (no client library). Connected from the Vercel dashboard
// (Storage → Upstash Redis), which adds these variables. Without them, counting is off.
const url = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const redisReady = () => !!url() && !!token();

// Runs several commands in one request; returns each result (null on error).
export async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!redisReady()) return cmds.map(() => null);
  const res = await fetch(`${url()}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return ((await res.json()) as { result?: unknown; error?: string }[]).map((r) => (r.error ? null : r.result ?? null));
}
