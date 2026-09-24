import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/lib/dict";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Private admin pages: password prompt (see lib/admin.ts).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const pass = process.env.ADMIN_PASSWORD, h = req.headers.get("authorization");
    const ok = !!pass && !!h?.startsWith("Basic ") && atob(h.slice(6)) === `6mlab:${pass}`;
    return ok ? NextResponse.next() : new NextResponse("Accès réservé", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="6M Lab admin", charset="UTF-8"' } });
  }
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const wantsFr = (req.headers.get("accept-language") ?? "").toLowerCase().startsWith("fr");
  const url = req.nextUrl.clone();
  url.pathname = `/${wantsFr ? "fr" : "en"}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next|api|apple-icon|.*\\..*).*)"] };