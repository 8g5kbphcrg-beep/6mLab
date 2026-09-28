import { cookies } from "next/headers";
import { ACCESS_COOKIE, DEVICE_COOKIE, readAccess } from "@/lib/access";
import { readSession, SESSION_COOKIE } from "@/lib/client-auth";
import { getClubCode } from "@/lib/club-access";

// In a page: the end of this device's access (ms), or null. A club access (lib/club-access.ts) is
// also checked against its code, so deleting the code or freeing its devices closes it at once.
export async function accessEnd(): Promise<number | null> {
  const c = await cookies(), v = c.get(ACCESS_COOKIE)?.value, device = c.get(DEVICE_COOKIE)?.value;
  const end = readAccess(v, device);
  if (!end || !v?.startsWith("club-")) return end;
  const code = await getClubCode(`CLUB-${v.split(".")[0].slice(5)}`).catch(() => null);
  return code && device && code.devices.includes(device) ? Math.min(end, code.end) : null;
}
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
