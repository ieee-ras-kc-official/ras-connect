import type { Metadata } from "next";
import { ChaptersPageClient } from "./ChaptersPageClient";

export const metadata: Metadata = {
  alternates: { canonical: "/chapters/" },
  title: "IEEE RAS Student Branch Chapters",
  description:
    "Discover the engineering colleges, student branch chapters, and active community hubs driving robotics innovation across Kerala on RAS Connect.",
};

export default function ChaptersPage() {
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
        <ChaptersPageClient />
      </div>
    </section>
  );
}
