import type { Metadata } from "next";
import { ChapterPageClient } from "./ChapterPageClient";
import { API_BASE_URL } from "@/config/api";

type ChapterPageProps = {
  params: Promise<{ chapterSlug: string }>;
};

async function fetchChapter(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters`);
    if (!res.ok) return [];
    const chapters = await res.json();
    return chapters.map((chapter: any) => ({ chapterSlug: chapter.slug }));
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { chapterSlug } = await params;
  const chapter = await fetchChapter(chapterSlug);
  if (!chapter) return {};
  return {
    title: chapter.name,
    description: `${chapter.college} events featured on RAS Connect.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  return <ChapterPageClient chapterSlug={chapterSlug} />;
}
