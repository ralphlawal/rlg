import { ogSize, renderOg } from "@/lib/og";

export const alt = "Ralph Lawal Group: Ideas deserve better execution.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ label: "Software · Apps · AI", title: "Ideas deserve better execution." });
}
