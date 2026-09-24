import { ImageResponse } from "next/og";
import { ICON } from "@/components/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS adds its own rounded corners, so the tile is drawn square here.
export default function AppleIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${ICON.replace('rx="11"', 'rx="0"')}</svg>`;
  return new ImageResponse(
    <img width={180} height={180} src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} alt="" />,
    size,
  );
}
