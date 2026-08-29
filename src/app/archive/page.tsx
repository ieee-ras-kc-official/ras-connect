import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveBrowser } from "@/components/archive-browser";
import { chapters, events } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Event archive",
  description: "Past RAS Connect events, organized for easy browsing.",
};

function ArchiveFallback() {
  return (
    <div className="mt-12 animate-pulse">
      <div className="h-36 rounded-[14px] bg-surface-strong" />
      <div className="mt-14 h-10 w-28 rounded bg-surface-strong" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[16/10] rounded-[14px] bg-surface-strong" />
            <div className="mt-4 h-6 w-3/4 rounded bg-surface-strong" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const archivedEvents = events.filter((event) => event.archived);

  return (
    <section className="min-h-[calc(100dvh-var(--header-height))] py-16 md:py-24">
      <div className="page-container">
        <div className="max-w-3xl">
          <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] text-brand sm:text-5xl lg:text-6xl">
            Event archive
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted">
            Past RAS Connect events, organized for easy browsing.
          </p>
        </div>
        <Suspense fallback={<ArchiveFallback />}>
          <ArchiveBrowser events={archivedEvents} chapters={chapters} />
        </Suspense>
      </div>
    </section>
  );
}
