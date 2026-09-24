import { ImageResponse } from "next/og";
import { iconSvg } from "@/lib/mark.mjs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS adds its own rounded corners, so the tile is drawn square here.
export default function AppleIcon() {
  const svg = iconSvg(0);
  return new ImageResponse(
    <img width={180} height={180} src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} alt="" />,
    size,
  );
}
