"use client";

import {
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { EventCard } from "@/components/event-card";
import type { Chapter, RasEvent } from "@/data/mock-data";

const PAGE_SIZE = 4;

type ArchiveBrowserProps = {
  events: RasEvent[];
  chapters: Chapter[];
};

function getEventYear(event: any): number {
  if (typeof event?.date?.year === "number") return event.date.year;
  const dateStr = typeof event?.date === "string" ? event.date : (event?.date?.label || "");
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return new Date(parsed).getFullYear();
  const match = dateStr.match(/\b(20\d{2})\b/);
  if (match) return parseInt(match[1], 10);
  return new Date().getFullYear();
}

export function ArchiveBrowser({ events, chapters }: ArchiveBrowserProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const query = searchParams.get("q") ?? "";
  const chapterSlug = searchParams.get("chapter") ?? "all";
  const requestedYear = searchParams.get("year");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const chapterFilteredEvents = useMemo(
    () =>
      chapterSlug === "all"
        ? events
        : events.filter((event) => event.chapterSlug === chapterSlug),
    [chapterSlug, events],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          events
            .map((event) => getEventYear(event))
            .filter((year): year is number => typeof year === "number"),
        ),
      ).sort((a, b) => b - a),
    [events],
  );

  const chapterYears = useMemo(
    () =>
      Array.from(
        new Set(
          chapterFilteredEvents
            .map((event) => getEventYear(event))
            .filter((year): year is number => typeof year === "number"),
        ),
      ).sort((a, b) => b - a),
    [chapterFilteredEvents],
  );

  const defaultYear = String(chapterYears[0] ?? years[0] ?? "all");
  const year = requestedYear ?? defaultYear;

  const replaceParams = (
    updates: Record<string, string | null>,
    mode: "replace" | "push" = "replace",
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
      else if (key === "year" && value === "all") params.set(key, "all");
      else params.delete(key);
    });
    const next = params.size ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => {
      if (mode === "push") router.push(next, { scroll: false });
      else router.replace(next, { scroll: false });
    });
  };

  useEffect(() => {
    if (!requestedYear && defaultYear !== "all") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", defaultYear);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [defaultYear, pathname, requestedYear, router, searchParams]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return chapterFilteredEvents
      .filter((event) => year === "all" || String(getEventYear(event)) === year)
      .filter((event) => {
        if (!normalized) return true;
        const chapter = chapters.find(
          (candidate) => candidate.slug === event.chapterSlug,
        );
        return [event.name, chapter?.name, chapter?.college].some((value) =>
          value?.toLocaleLowerCase().includes(normalized),
        );
      })
      .sort((a, b) => (b.date?.iso ?? "").localeCompare(a.date?.iso ?? ""));
  }, [chapterFilteredEvents, chapters, query, year]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const grouped = useMemo(() => {
    const result = new Map<number, Map<string, RasEvent[]>>();
    visible.forEach((event) => {
      const eventYear = getEventYear(event);
      if (!result.has(eventYear)) result.set(eventYear, new Map());
      const byChapter = result.get(eventYear)!;
      const existing = byChapter.get(event.chapterSlug) ?? [];
      existing.push(event);
      byChapter.set(event.chapterSlug, existing);
    });
    return result;
  }, [visible]);

  const filtersActive = Boolean(query) || chapterSlug !== "all" || year !== defaultYear;

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (years[0]) params.set("year", String(years[0]));
    startTransition(() =>
      router.replace(
        params.size ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false },
      ),
    );
  };

  return (
    <div className="mt-12">
      <div className="border-b border-line pb-6">
        <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => replaceParams({ chapter: "all", page: null })}
            className={`uppercase tracking-wider transition-colors pb-1 ${
              chapterSlug === "all"
                ? "font-bold text-brand border-b-2 border-brand"
                : "text-muted hover:text-ink"
            }`}
          >
            All
          </button>
          {chapters.map((chapter) => {
            const shortName = chapter.name
              .replace("Robotics Society", "")
              .replace("IEEE RAS", "")
              .replace("RAS SBC", "")
              .replace("RAS", "")
              .trim();
            return (
              <button
                key={chapter.slug}
                type="button"
                onClick={() =>
                  replaceParams({ chapter: chapter.slug, page: null })
                }
                className={`uppercase tracking-wider transition-colors pb-1 ${
                  chapterSlug === chapter.slug
                    ? "font-bold text-brand border-b-2 border-brand"
                    : "text-muted hover:text-ink"
                }`}
              >
                {shortName}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-5 font-mono text-xs text-muted">
        {isPending
          ? "Updating archive"
          : `${filtered.length} ${filtered.length === 1 ? "event" : "events"}`}
      </p>

      {visible.length ? (
        <motion.div layout className="mt-10 space-y-16">
          {Array.from(grouped.entries())
            .sort(([a], [b]) => b - a)
            .map(([groupYear, byChapter]) => (
              <section key={groupYear} aria-labelledby={`archive-year-${groupYear}`}>
                <h2
                  id={`archive-year-${groupYear}`}
                  className="border-b border-line pb-2 text-3xl font-black uppercase tracking-tight text-ink"
                >
                  {groupYear}
                </h2>
                <div className="mt-10 space-y-14">
                  {Array.from(byChapter.entries()).map(
                    ([groupChapterSlug, groupEvents]) => {
                      const chapter = chapters.find(
                        (candidate) => candidate.slug === groupChapterSlug,
                      );
                      return (
                        <section
                          key={groupChapterSlug}
                          aria-labelledby={`archive-${groupYear}-${groupChapterSlug}`}
                        >
                          {chapterSlug === "all" && (
                            <h3
                              id={`archive-${groupYear}-${groupChapterSlug}`}
                              className="text-balance text-lg font-bold uppercase tracking-tight text-ink"
                            >
                              {chapter?.college ?? chapter?.name ?? "Student Branch Chapter"}
                            </h3>
                          )}
                          <div className="mt-6 no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-4 pt-1 gap-6">
                            {groupEvents.map((event, index) => (
                              <div
                                key={event.slug}
                                className="shrink-0 w-[280px] sm:w-[300px] snap-start"
                              >
                                <EventCard event={event} index={index} />
                              </div>
                            ))}
                          </div>
                        </section>
                      );
                    },
                  )}
                </div>
              </section>
            ))}
        </motion.div>
      ) : (
        <div className="mt-10 grid min-h-64 place-items-center border border-dashed border-line bg-surface-soft/45 px-6 py-12 text-center rounded-none">
          <div>
            <span className="mx-auto grid size-12 place-items-center border border-line bg-surface text-brand rounded-none">
              <MagnifyingGlassIcon size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-ink">
              No archived events match these filters.
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 min-h-11 bg-brand px-5 text-sm font-bold text-white transition-[background-color,transform] hover:bg-brand-deep active:scale-[0.98] rounded-none"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {visible.length < filtered.length ? (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() =>
              replaceParams({ page: String(page + 1) }, "push")
            }
            className="min-h-12 border border-line bg-surface px-7 text-sm font-bold text-brand transition-[background-color,transform] hover:bg-surface-soft active:scale-[0.98] rounded-none"
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
}
