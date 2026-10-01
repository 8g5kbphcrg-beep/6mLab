import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { stripe } from "@/lib/feedback";
import { ACCESS_COOKIE, DEVICE_COOKIE, readAccess } from "@/lib/access";
import { readSession, SESSION_COOKIE } from "@/lib/client-auth";
import { getClubCode } from "@/lib/club-access";
import { CLUB_EXERCISES } from "@/lib/library";

// In a page: this device's access, or null: its end (ms) and its kind, "client" (an individual
// program, the individual library) or "club" (a team's club code, the club library). A club access
// (lib/club-access.ts) is also checked against its code, so deleting the code or freeing its
// devices closes it at once.
export async function accessInfo(): Promise<{ end: number; kind: "client" | "club" } | null> {
  const c = await cookies(), v = c.get(ACCESS_COOKIE)?.value, device = c.get(DEVICE_COOKIE)?.value;
  const end = readAccess(v, device);
  if (!end) return null;
  if (!v?.startsWith("club-")) return { end, kind: "client" };
  const code = await getClubCode(`CLUB-${v.split(".")[0].slice(5)}`).catch(() => null);
  return code && device && code.devices.includes(device) ? { end: Math.min(end, code.end), kind: "club" } : null;
}
export const accessEnd = async () => (await accessInfo())?.end ?? null;
export const accessKind = async () => (await accessInfo())?.kind ?? null;
// In a page: the order (PaymentIntent id) behind this device's open access, or null.
export async function accessPi(): Promise<string | null> {
  const c = await cookies(), v = c.get(ACCESS_COOKIE)?.value;
  return v && readAccess(v, c.get(DEVICE_COOKIE)?.value) ? v.split(".")[0] : null;
}
// In a page: the email logged in to the customer area (lib/client-auth.ts), or null.
export async function sessionEmail(): Promise<string | null> {
  return readSession((await cookies()).get(SESSION_COOKIE)?.value);
}
export type Gate = { acces?: string; ref?: string; offre?: string; retour?: string };
// ?retour=<page of the site> on the links to an exercise: where its cross goes back to.
export const backPath = (p?: string) => (p && /^\/(fr|en)(\/[a-z0-9-]+)*$/.test(p) ? p : undefined);
// In a page: whether this device may open an exercise: any exercise with an individual program,
// only those of the club programs with a club code (lib/library.ts).
export async function allowed(id: string): Promise<boolean> {
  const a = await accessInfo();
  return !!a && (a.kind === "client" || CLUB_EXERCISES.includes(id));
}

// The name written in watermark over the animations (components/Protected.tsx): the buyer's first
// name and order reference, or the club code. Read once a day per order from Stripe.
const orderMark = unstable_cache(async (pi: string) => {
  const s = stripe();
  if (!s) return null;
  const m = (await s.paymentIntents.retrieve(pi)).metadata ?? {};
  return [m.firstName, m.ref ? `réf. ${m.ref.toUpperCase()}` : null].filter(Boolean).join(" · ") || null;
}, ["order-mark"], { revalidate: 86400 });
export async function watermark(): Promise<string | null> {
  const a = await accessInfo();
  if (!a) return null;
  const v = (await cookies()).get(ACCESS_COOKIE)?.value ?? "";
  if (a.kind === "club") return `CLUB-${v.split(".")[0].slice(5)}`;
  const pi = v.split(".")[0];
  return /^pi_\w+$/.test(pi) ? orderMark(pi).catch(() => null) : null;
}
