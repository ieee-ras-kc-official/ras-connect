import type { Metadata } from "next";
import { Suspense } from "react";
import { ChapterSearch } from "@/components/chapter-search";
import { API_BASE_URL } from "@/config/api";

export const metadata: Metadata = {
  title: "Student Branch Chapters",
  description:
    "Explore the colleges and student communities contributing to RAS Connect.",
};

async function getChapters() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [];
  }
}

function SearchFallback() {
  return (
    <div className="mt-12 animate-pulse">
      <div className="h-5 w-48 rounded bg-surface-strong" />
      <div className="mt-2 h-13 max-w-2xl rounded-[10px] bg-surface-strong" />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-[14px] bg-surface-strong" />
        ))}
      </div>
    </div>
  );
}

export default async function ChaptersPage() {
  const chapters = await getChapters();

  return (
    <section className="min-h-[calc(100dvh-var(--header-height))] py-16 md:py-24">
      <div className="page-container">
        <div className="max-w-3xl">
          <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] text-brand sm:text-5xl lg:text-6xl">
            Student Branch Chapters
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted">
            Explore the colleges and student communities contributing to RAS Connect.
          </p>
        </div>
        <Suspense fallback={<SearchFallback />}>
          <ChapterSearch chapters={chapters} />
        </Suspense>
      </div>
    </section>
  );
}
