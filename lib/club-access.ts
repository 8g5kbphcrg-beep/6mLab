import { randomInt } from "node:crypto";
import { redis, redisReady } from "@/lib/redis";

// Access codes for club teams (admin > Clubs): the coach gives the code to the players, and the
// eye of the club documents opens the animations on the site (lib/access.ts, access cookie). One
// code per team, open until the end date (the season), on max devices at most (the squad plus
// staff). Kept in Redis: club:<CODE> = the code, and the set "clubcodes" lists them.
export type ClubCode = { code: string; club: string; team: string; end: number; max: number; devices: string[]; created: number };

const KEY = (code: string) => `club:${code}`;
const SET = "clubcodes";
// Letters and digits without the ones that look alike (0/O, 1/I/L).
const ABC = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const part = () => Array.from({ length: 4 }, () => ABC[randomInt(ABC.length)]).join("");
export const cleanClubCode = (raw: string) => {
  const c = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^CLUB[A-Z0-9]{8}$/.test(c) ? `CLUB-${c.slice(4, 8)}-${c.slice(8)}` : null;
};
// In the access cookie, the club code stands where an order id would ("club-XXXX-XXXX").
export const clubPi = (code: string) => `club-${code.slice(5)}`;

export async function createClubCode(club: string, team: string, end: number, max: number): Promise<ClubCode> {
  if (!redisReady()) throw new Error("Redis non branché");
  for (;;) {
    const c: ClubCode = { code: `CLUB-${part()}-${part()}`, club, team, end, max, devices: [], created: Date.now() };
    const [ok] = await redis([["SET", KEY(c.code), JSON.stringify(c), "NX"]]);
    if (ok === "OK") {
      await redis([["SADD", SET, c.code]]);
      return c;
    }
  }
}

export async function getClubCode(code: string): Promise<ClubCode | null> {
  if (!redisReady()) return null;
  const [v] = await redis([["GET", KEY(code)]]);
  return typeof v === "string" ? (JSON.parse(v) as ClubCode) : null;
}

export async function listClubCodes(): Promise<ClubCode[]> {
  if (!redisReady()) return [];
  const [codes] = await redis([["SMEMBERS", SET]]);
  const list = (codes as string[] | null) ?? [];
  if (!list.length) return [];
  const vals = await redis(list.map((c) => ["GET", KEY(c)]));
  return vals.filter((v): v is string => typeof v === "string").map((v) => JSON.parse(v) as ClubCode).sort((a, b) => b.created - a.created);
}

const save = (c: ClubCode) => redis([["SET", KEY(c.code), JSON.stringify(c)]]);

// Opening the animations with a club code on this device: ok with the end of the access, or why not.
export async function openClub(raw: string, device: string, now = Date.now()): Promise<{ ok: true; code: string; end: number } | { ok: false; why: "club-inconnu" | "club-fini" | "club-plein" }> {
  const code = cleanClubCode(raw);
  const c = code ? await getClubCode(code) : null;
  if (!c) return { ok: false, why: "club-inconnu" };
  if (c.end <= now) return { ok: false, why: "club-fini" };
  if (!c.devices.includes(device)) {
    if (c.devices.length >= c.max) return { ok: false, why: "club-plein" };
    c.devices.push(device);
    await save(c);
  }
  return { ok: true, code: c.code, end: c.end };
}

export async function freeClubDevices(code: string) {
  const c = await getClubCode(code);
  if (c) await save({ ...c, devices: [] });
}
export async function deleteClubCode(code: string) {
  await redis([["DEL", KEY(code)], ["SREM", SET, code]]);
}
