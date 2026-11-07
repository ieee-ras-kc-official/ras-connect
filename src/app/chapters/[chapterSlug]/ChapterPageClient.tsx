"use client";
import NotFound from "@/app/not-found";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { EventCard } from "@/components/event-card";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Reveal } from "@/components/reveal";
import { API_BASE_URL, ApiError, apiList, readJson } from "@/config/api";
import { isEventPassed } from "@/utils/date";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Chapter, RasEvent } from "@/types/api";

type Props = {
  chapterSlug: string;
  initialChapter: Chapter;
};


export function ChapterPageClient({ chapterSlug, initialChapter }: Props) {
  const [chapter, setChapter] = useState<Chapter | null>(initialChapter);
  const [events, setEvents] = useState<RasEvent[]>([]);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const slug = chapterSlug;
        const chapterRes = await fetch(`${API_BASE_URL}/api/chapters/${encodeURIComponent(slug)}`);
        if (chapterRes.status === 404) { setChapter(null); return; }
        const loadedChapter = await readJson<Chapter>(chapterRes);
        setChapter(loadedChapter);
        setError("");
        try { setEvents(await apiList<RasEvent>(`/api/events?chapter=${encodeURIComponent(slug)}`)); }
        catch { setError("Chapter loaded, but its events are unavailable. Please retry."); }

      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load the chapter. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [chapterSlug, attempt]);

  if (error && !chapter) return <div role="alert" className="page-container py-12"><p>{error}</p><button onClick={() => setAttempt(n => n + 1)}>Retry</button></div>;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse">
        <div className="h-8 w-48 bg-surface-strong mb-4" />
        <div className="h-4 w-96 bg-surface-strong" />
      </div>
    );
  }

  if (!chapter) return <NotFound />;

  const currentEvents = events.filter((event: RasEvent) => !isEventPassed(event.date));
  const archivedEvents = events.filter((event: RasEvent) => isEventPassed(event.date));

  return (
    <>
      <section className="pb-12 pt-8 md:pb-16 md:pt-10">
        <div className="page-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Chapters", href: "/chapters" },
              { label: chapter.name },
            ]}
          />

          <div className="mt-9 max-w-3xl">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="size-20 sm:size-24 bg-surface-soft border border-line shrink-0 p-2 overflow-hidden relative">
                  <ImageWithFallback
                    src={
                      chapter.logo && chapter.logo !== "/card1.jpeg"
                        ? chapter.logo
                        : "/images/brand/default-chapter-icon.svg"
                    }
                    alt={chapter.name}
                    fallbackSrc="/images/brand/default-chapter-icon.svg"
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <h1 className="text-balance text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl uppercase">
                    {chapter.name}
                  </h1>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                    {chapter.college} {chapter.location && `• ${chapter.location}`}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                {chapter.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {error && <p role="alert" className="page-container">{error} <button onClick={() => setAttempt(n => n + 1)}>Retry</button></p>}
      <section className="border-t border-line bg-background py-10 md:py-14" aria-labelledby="chapter-events-heading">
        <div className="page-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <Reveal>
              <h2
                id="chapter-events-heading"
                className="text-xl font-bold uppercase tracking-tight text-ink"
              >
                Events by this chapter
              </h2>
            </Reveal>

            {archivedEvents.length ? (
              <Reveal>
                <Link
                  href={`/archive?chapter=${encodeURIComponent(chapter.slug)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:text-brand rounded-none"
                >
                  View archived events
                  <ArrowRightIcon size={14} aria-hidden="true" />
                </Link>
              </Reveal>
            ) : null}
          </div>

          {currentEvents.length ? (
            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-4 pt-1 gap-6">
              {currentEvents.map((event: RasEvent, index: number) => (
                <div
                  key={event.slug}
                  className="shrink-0 w-[280px] sm:w-[300px] snap-start"
                >
                  <EventCard event={event} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <EmptyState
                title="No events have been published for this chapter yet."
                description="Published activities will appear here when chapter content is available."
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
