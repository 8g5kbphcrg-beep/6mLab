import { cookies } from "next/headers";
import { ACCESS_COOKIE, CLIENT_COOKIE, DEVICE_COOKIE, readAccess, readClient } from "@/lib/access";

// In a page: the end of this device's access (ms), or null.
export async function accessEnd(): Promise<number | null> {
  const c = await cookies();
  return readAccess(c.get(ACCESS_COOKIE)?.value, c.get(DEVICE_COOKIE)?.value);
}
// In a page: the order (PaymentIntent id) behind this device's open access, or null.
export async function accessPi(): Promise<string | null> {
  const c = await cookies(), v = c.get(ACCESS_COOKIE)?.value;
  return v && readAccess(v, c.get(DEVICE_COOKIE)?.value) ? v.split(".")[0] : null;
}
// In a page: the order whose customer area is open on this device (reference checked, or
// animations opened), or null.
export async function clientPi(): Promise<string | null> {
  const c = await cookies();
  return readClient(c.get(CLIENT_COOKIE)?.value) ?? (await accessPi());
}
export type Gate = { acces?: string; ref?: string; offre?: string; retour?: string };
// ?retour=<page of the site> on the links to an exercise: where its cross goes back to.
export const backPath = (p?: string) => (p && /^\/(fr|en)(\/[a-z0-9-]+)*$/.test(p) ? p : undefined);
