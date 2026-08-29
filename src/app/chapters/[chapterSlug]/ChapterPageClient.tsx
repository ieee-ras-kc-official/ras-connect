"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { EventCard } from "@/components/event-card";
import { Reveal } from "@/components/reveal";
import { API_BASE_URL } from "@/config/api";

type Props = {
  chapterSlug: string;
};

import { isEventPassed } from "@/utils/date";

export function ChapterPageClient({ chapterSlug }: Props) {
  const [chapter, setChapter] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [chapterRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/chapters/${chapterSlug}`),
          fetch(`${API_BASE_URL}/api/events?chapter=${chapterSlug}`)
        ]);

        if (chapterRes.ok && eventsRes.ok) {
          setChapter(await chapterRes.json());
          setEvents(await eventsRes.json());
        }
      } catch (err) {
        console.error("Failed to load chapter dynamic data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [chapterSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center select-none animate-pulse">
        <div className="h-8 w-48 bg-surface-strong mb-4" />
        <div className="h-4 w-96 bg-surface-strong" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold uppercase text-ink">Chapter not found</h2>
        <Link href="/chapters" className="mt-4 text-sm font-bold text-brand hover:underline">
          Back to all chapters
        </Link>
      </div>
    );
  }

  const currentEvents = events.filter((event: any) => {
    const dateStr = typeof event.date === "string" 
      ? event.date 
      : event.date?.label || "";
    return !event.archived && !isEventPassed(dateStr);
  });
  const archivedEvents = events.filter((event: any) => {
    const dateStr = typeof event.date === "string" 
      ? event.date 
      : event.date?.label || "";
    return event.archived || isEventPassed(dateStr);
  });

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
              <h1 className="text-balance text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl uppercase">
                {chapter.name}
              </h1>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                {chapter.college}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                {chapter.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

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
                  href={`/archive?chapter=${chapter.slug}`}
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
              {currentEvents.map((event: any, index: number) => (
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
