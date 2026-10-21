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
  let chapter = await fetchChapter(chapterSlug);
  if (!chapter) {
    chapter = fallbackChapters.find((c) => c.slug === chapterSlug);
  }
  if (!chapter) return { title: "Chapter Not Found | RAS Connect IEEE" };

  const title = `${chapter.name} | RAS Connect IEEE`;
  const description = `${chapter.name} representing ${chapter.college}, ${chapter.location || "Kerala"}. Discover robotics events, technical workshops, and chapter milestones on RAS Connect IEEE.`;
  const url = `https://connect.ras.ieeekerala.org/chapters/${chapterSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "RAS Connect IEEE",
      images: [
        {
          url:
            chapter.logo && chapter.logo !== "/card1.jpeg"
              ? chapter.logo.startsWith("http")
                ? chapter.logo
                : `https://connect.ras.ieeekerala.org${chapter.logo}`
              : "https://connect.ras.ieeekerala.org/images/brand/ieee-ras-logo.png",
          alt: `${chapter.name} Logo`,
        },
      ],
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  return <ChapterPageClient chapterSlug={chapterSlug} />;
}
