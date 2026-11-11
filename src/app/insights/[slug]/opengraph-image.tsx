import { ogSize, renderOg } from "@/lib/og";
import { articles, getArticle } from "@/content/insights";

export const alt = "Ralph Lawal Group insight";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  return renderOg({ label: a ? `Insights · ${a.topic}` : "Insights", title: a?.title ?? "Notes from the work." });
}
