import { redis, redisReady } from "@/lib/redis";
import { mailReady, sendAlert } from "@/lib/email";
import { SITE } from "@/lib/dict";

// When something important fails (a paid order whose program did not go out, a checkout that
// could not open, a form that could not be sent, a scheduled email run), 6M Lab gets an email
// right away, and the alert is kept for the admin home page: if sending emails is what fails,
// the admin still shows it. The same alert (same key) is listed and emailed once a day at most.
// Never throws: an alert must not break the page that raised it.
export type Alert = { at: string; title: string; details: string[] };

const LIST = "alerts";

export async function alert(key: string, title: string, details: string[]) {
  console.error("[alerte]", title, details.join(" | "));
  const a: Alert = { at: new Date().toISOString(), title, details };
  let email = true;
  try {
    if (redisReady()) {
      // The same alert (same key) is listed and emailed once a day at most.
      const [fresh] = await redis([["SET", `alert:${key}`, "1", "NX", "EX", 86400]]);
      email = fresh === "OK";
      if (email) await redis([["LPUSH", LIST, JSON.stringify(a)], ["LTRIM", LIST, 0, 49]]);
    }
  } catch (e) {
    console.error("[alerte] redis", e);
  }
  if (!email || !mailReady()) return;
  try {
    await sendAlert(title, [...details, "", `Les dernières alertes sont aussi sur l'accueil de l'admin : ${SITE}/admin`].join("\n"));
  } catch (e) {
    console.error("[alerte] email", e);
  }
}

// The latest alerts, newest first (admin home page).
export async function recentAlerts(n = 10): Promise<Alert[]> {
  if (!redisReady()) return [];
  try {
    const [list] = await redis([["LRANGE", LIST, 0, n - 1]]);
    return ((list as string[] | null) ?? []).map((s) => JSON.parse(s) as Alert);
  } catch {
    return [];
  }
}

// Empties the list on the admin home page, once the alerts are handled.
export async function clearAlerts() {
  if (redisReady()) await redis([["DEL", LIST]]).catch(() => {});
}

// The error message only, short (never a password: nodemailer and Stripe do not put secrets in it).
export const why = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 300);
