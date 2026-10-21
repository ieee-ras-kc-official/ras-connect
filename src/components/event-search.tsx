"use client";

import {
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useTransition } from "react";
import { EventCard } from "@/components/event-card";
import type { RasEvent, Chapter } from "@/data/mock-data";

export function EventSearch({ events, chapters }: { events: any[]; chapters: any[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  
  const query = searchParams.get("q") ?? "";
  const selectedChapter = searchParams.get("chapter") ?? "";
  const deferredQuery = useDeferredValue(query);

  const filteredEvents = useMemo(() => {
    let result = events;
    
    if (selectedChapter) {
      result = result.filter(e => e.chapterSlug === selectedChapter);
    }
    
    const normalized = deferredQuery.trim().toLocaleLowerCase();
    if (normalized) {
      result = result.filter((event) => {
        const descStr = Array.isArray(event.description)
          ? event.description.join(" ")
          : typeof event.description === "string"
          ? event.description
          : "";
        return [event.name, event.location, descStr].some((value) =>
          value ? value.toLocaleLowerCase().includes(normalized) : false,
        );
      });
    }
    return result;
  }, [events, deferredQuery, selectedChapter]);

  if (events.length === 0) {
    return (
      <div className="mt-12 border border-line p-8 bg-surface-soft text-center flex flex-col items-center justify-center min-h-[240px]">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink mb-2">
          No Events Logged
        </h3>
        <p className="text-sm text-muted">
          No events have been published yet. Please check back later or use the admin console to add events.
        </p>
      </div>
    );
  }

  const updateParams = (newQuery: string, newChapter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery.trim()) params.set("q", newQuery);
    else params.delete("q");

    if (newChapter) params.set("chapter", newChapter);
    else params.delete("chapter");

    const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router.replace(nextUrl, { scroll: false }));
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <div className="flex-1 max-w-xl">
          <label
            htmlFor="event-search"
            className="mb-2 block text-sm font-bold text-ink"
          >
            Search events
          </label>
          <div className="relative">
            <MagnifyingGlassIcon
              size={20}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="event-search"
              type="search"
              value={query}
              onChange={(event) => updateParams(event.target.value, selectedChapter)}
              placeholder="Type event name or keywords"
              autoComplete="off"
              className="min-h-13 w-full border border-line bg-surface py-3 pl-12 pr-12 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => updateParams("", selectedChapter)}
                aria-label="Clear event search"
                className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-muted transition-colors hover:bg-surface-soft hover:text-brand"
              >
                <XIcon size={18} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="w-full md:w-64">
          <label
            htmlFor="chapter-filter"
            className="mb-2 block text-sm font-bold text-ink"
          >
            Filter by Chapter
          </label>
          <select
            id="chapter-filter"
            value={selectedChapter}
            onChange={(e) => updateParams(query, e.target.value)}
            className="min-h-13 w-full border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition-[border-color,box-shadow] focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-none"
          >
            <option value="">All Chapters</option>
            {chapters.map((ch) => (
              <option key={ch.slug} value={ch.slug}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-5 font-mono text-xs text-muted">
        {isPending
          ? "Updating results"
          : `${filteredEvents.length} ${filteredEvents.length === 1 ? "event" : "events"}`}
      </p>

      {filteredEvents.length ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredEvents.map((event, index) => (
              <div
                key={event.slug}
                className="w-full"
              >
                <EventCard event={event} index={index} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mt-8 grid min-h-64 place-items-center border border-dashed border-line bg-surface-soft/45 px-6 py-12 text-center">
          <div>
            <h2 className="mt-5 text-xl font-bold text-ink">
              No events match that search.
            </h2>
            <button
              type="button"
              onClick={() => updateParams("", "")}
              className="mt-6 min-h-11 border border-brand text-brand hover:bg-brand hover:text-white px-5 text-sm font-bold transition-all"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
