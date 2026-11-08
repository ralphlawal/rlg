import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/**
 * One share-image design for every page: the official logo, the page title in the site's type,
 * and a mono label. Black on white, matching the default (light) theme.
 */
export async function renderOg({ label, title }: { label: string; title: string }) {
  const root = process.cwd();
  const [sans, mono, logo] = await Promise.all([
    readFile(join(root, "src/assets/fonts/InstrumentSans-SemiCondensed-SemiBold.ttf")),
    readFile(join(root, "src/assets/fonts/JetBrainsMono-Medium.ttf")),
    readFile(join(root, "src/assets/brand/logo-black.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const size = title.length > 48 ? 64 : title.length > 28 ? 80 : 104;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fff", color: "#000", padding: "56px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={205} height={128} alt="" />
          <div style={{ fontFamily: "Mono", fontSize: 22, letterSpacing: 1, textTransform: "uppercase", color: "#6b6b6b" }}>{label}</div>
        </div>
        <div style={{ display: "flex", fontFamily: "Sans", fontSize: size, lineHeight: 0.98, letterSpacing: -2, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #000", paddingTop: 20, fontFamily: "Mono", fontSize: 20, letterSpacing: 1, textTransform: "uppercase" }}>
          <span>Ralph Lawal Group</span>
          <span style={{ color: "#6b6b6b" }}>Dublin, Ireland</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Sans", data: sans, weight: 600, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
