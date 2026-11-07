import { getPublicChapter } from "@/lib/content";
import { resolveMediaUrl } from "@/config/api";
import type { Metadata } from "next";
import { ChapterPageClient } from "./ChapterPageClient";
type Props = { params: Promise<{ chapterSlug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterSlug } = await params;
  const record = await getPublicChapter(chapterSlug);
  const description = record.description || `${record.name} representing ${record.college}, ${record.location}.`;
  const url = `/chapters/${encodeURIComponent(chapterSlug)}/`;
  const image = resolveMediaUrl(record.logo);
  return {
    title: record.name, description: description.slice(0, 160), alternates: { canonical: url },
    openGraph: { title: record.name, description: description.slice(0, 160), url, images: [{ url: image, alt: record.name }] },
    twitter: { card: "summary_large_image", title: record.name, images: [image] }
  };
}
export default async function Page({ params }: Props) {
  const { chapterSlug } = await params;
  const initialChapter = await getPublicChapter(chapterSlug);
  return <ChapterPageClient chapterSlug={chapterSlug} initialChapter={initialChapter} />;
}
