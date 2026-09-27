import { NextRequest, NextResponse } from "next/server";
import { animatedFigure, variants } from "@/programmes/source/figures.mjs";

// One animation alone, shown in a frame of the animations page (loaded only when opened).
export function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "", v = req.nextUrl.searchParams.get("v") ?? "";
  if (!variants(id).includes(v)) return new NextResponse("Animation introuvable", { status: 404 });
  const svg = animatedFigure(id, v) ?? "";
  return new NextResponse(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#F6F5FB}svg{width:100%;height:auto;max-height:260px;display:block}</style>${svg}`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "private, max-age=3600" } });
}
