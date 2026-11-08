import { ogSize, renderOg } from "@/lib/og";
import { getService, services } from "@/content/expertise";

export const alt = "Ralph Lawal Group expertise";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  return renderOg({ label: s?.name ?? "Expertise", title: s?.title ?? "What we build." });
}
