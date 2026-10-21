import type { Metadata } from "next";
import { ChapterPageClient } from "./ChapterPageClient";
import { API_BASE_URL } from "@/config/api";
import { chapters as fallbackChapters } from "@/data/mock-data";

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
    if (!res.ok) throw new Error("Fetch failed");
    const chapters = await res.json();
    if (!Array.isArray(chapters) || chapters.length === 0) {
      return fallbackChapters.map((chapter) => ({ chapterSlug: chapter.slug }));
    }
    return chapters.map((chapter: any) => ({ chapterSlug: chapter.slug }));
  } catch (err) {
    return fallbackChapters.map((chapter) => ({ chapterSlug: chapter.slug }));
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
