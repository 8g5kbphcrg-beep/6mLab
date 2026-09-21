import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/lib/dict";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const wantsFr = (req.headers.get("accept-language") ?? "").toLowerCase().startsWith("fr");
  const url = req.nextUrl.clone();
  url.pathname = `/${wantsFr ? "fr" : "en"}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };