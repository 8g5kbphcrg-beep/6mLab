import { cookies } from "next/headers";
import { ACCESS_COOKIE, DEVICE_COOKIE, readAccess } from "@/lib/access";

// In a page: the end of this device's access (ms), or null.
export async function accessEnd(): Promise<number | null> {
  const c = await cookies();
  return readAccess(c.get(ACCESS_COOKIE)?.value, c.get(DEVICE_COOKIE)?.value);
}
export type Gate = { acces?: string; ref?: string; offre?: string; retour?: string };
// ?retour=<page of the site> on the links to an exercise: where its cross goes back to.
export const backPath = (p?: string) => (p && /^\/(fr|en)(\/[a-z0-9-]+)*$/.test(p) ? p : undefined);
