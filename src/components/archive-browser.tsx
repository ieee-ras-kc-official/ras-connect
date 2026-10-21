"use client";

import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
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

function formatChapterShortName(name: string): string {
  if (!name) return "";
  const clean = name
    .replace(/Robotics\s*(&|and)?\s*Automation\s*Society/gi, "")
    .replace(/Robotics\s*Society/gi, "")
    .replace(/IEEE\s*/gi, "")
    .replace(/\bRAS\b/gi, "")
    .replace(/\bSBC\b/gi, "")
    .replace(/\bSB\b/gi, "")
    .replace(/\bKC\b/gi, "")
    .replace(/Student\s*Branch\s*(Chapter)?/gi, "")
    .replace(/^[-_\s]+|[-_\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean || name;
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, chapters]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -280 : 280;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

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

  // Center active chapter pill in scroll view
  useEffect(() => {
    if (chapterSlug && scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-chapter="${chapterSlug}"]`
      ) as HTMLElement | null;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [chapterSlug]);

  const currentChapter = useMemo(() => {
    return chapters.find((c) => c.slug === chapterSlug);
  }, [chapters, chapterSlug]);

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
      {/* Swiss Style Clean Filter Toolbar */}
      <div className="border border-line bg-surface p-4 sm:p-5 flex flex-col gap-4">
        {/* Top Controls: Search Input + Chapter Dropdown + Year Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <MagnifyingGlassIcon
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => replaceParams({ q: e.target.value || null, page: null })}
              placeholder="Search archive events, chapters, colleges..."
              className="w-full bg-background border border-line py-2.5 pl-10 pr-9 text-xs sm:text-sm text-ink outline-none transition-colors focus:border-brand rounded-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => replaceParams({ q: null, page: null })}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center text-muted hover:text-brand transition-colors"
              >
                <XIcon size={14} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {/* Chapter Selector Dropdown */}
          <div className="sm:col-span-4 relative">
            <select
              id="archive-chapter-select"
              aria-label="Filter by chapter"
              value={chapterSlug}
              onChange={(e) => replaceParams({ chapter: e.target.value, page: null })}
              className="w-full bg-background border border-line py-2.5 px-3 text-xs font-mono uppercase text-ink outline-none transition-colors focus:border-brand rounded-none cursor-pointer"
            >
              <option value="all">All Chapters ({chapters.length})</option>
              {chapters.map((ch) => (
                <option key={ch.slug} value={ch.slug}>
                  {formatChapterShortName(ch.name)} — {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector Dropdown */}
          <div className="sm:col-span-2 relative">
            <select
              id="archive-year-select"
              aria-label="Filter by year"
              value={year}
              onChange={(e) => replaceParams({ year: e.target.value, page: null })}
              className="w-full bg-background border border-line py-2.5 px-3 text-xs font-mono uppercase text-ink outline-none transition-colors focus:border-brand rounded-none cursor-pointer"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick-Filter Horizontal Scrollable Pill Strip */}
        <div className="relative flex items-center pt-2 border-t border-line/60">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`shrink-0 mr-2 grid size-8 place-items-center border border-line bg-background text-ink transition-opacity rounded-none select-none ${
              canScrollLeft
                ? "opacity-100 hover:bg-surface-soft hover:text-brand cursor-pointer"
                : "opacity-25 cursor-not-allowed"
            }`}
          >
            <CaretLeftIcon size={14} aria-hidden="true" />
          </button>

          {/* Horizontal Track of Pills */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            <button
              type="button"
              data-chapter="all"
              onClick={() => replaceParams({ chapter: "all", page: null })}
              className={`shrink-0 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all select-none border rounded-none ${
                chapterSlug === "all"
                  ? "bg-brand text-white border-brand font-bold shadow-sm"
                  : "bg-background border-line text-muted hover:text-ink hover:border-muted font-medium"
              }`}
            >
              All Chapters
            </button>
            {chapters.map((chapter) => {
              const shortName = formatChapterShortName(chapter.name);
              const isSelected = chapterSlug === chapter.slug;
              return (
                <button
                  key={chapter.slug}
                  data-chapter={chapter.slug}
                  type="button"
                  title={`${chapter.name} (${chapter.college || ""})`}
                  onClick={() => replaceParams({ chapter: chapter.slug, page: null })}
                  className={`shrink-0 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all select-none border rounded-none ${
                    isSelected
                      ? "bg-brand text-white border-brand font-bold shadow-sm"
                      : "bg-background border-line text-muted hover:text-ink hover:border-muted font-medium"
                  }`}
                >
                  {shortName}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`shrink-0 ml-2 grid size-8 place-items-center border border-line bg-background text-ink transition-opacity rounded-none select-none ${
              canScrollRight
                ? "opacity-100 hover:bg-surface-soft hover:text-brand cursor-pointer"
                : "opacity-25 cursor-not-allowed"
            }`}
          >
            <CaretRightIcon size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Active Filter Indicators & Result Count */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
        <div className="flex flex-wrap items-center gap-2">
          <span aria-live="polite">
            {isPending
              ? "Updating archive..."
              : `${filtered.length} ${filtered.length === 1 ? "event" : "events"} found`}
          </span>

          {currentChapter && (
            <span className="inline-flex items-center gap-1.5 bg-surface border border-line px-2.5 py-1 text-ink font-bold">
              <span>Chapter: {currentChapter.name}</span>
              <button
                type="button"
                onClick={() => replaceParams({ chapter: "all", page: null })}
                className="text-muted hover:text-brand ml-0.5"
                title="Remove chapter filter"
              >
                <XIcon size={12} aria-hidden="true" />
              </button>
            </span>
          )}

          {query && (
            <span className="inline-flex items-center gap-1.5 bg-surface border border-line px-2.5 py-1 text-ink font-bold">
              <span>Query: &ldquo;{query}&rdquo;</span>
              <button
                type="button"
                onClick={() => replaceParams({ q: null, page: null })}
                className="text-muted hover:text-brand ml-0.5"
                title="Remove search query"
              >
                <XIcon size={12} aria-hidden="true" />
              </button>
            </span>
          )}
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-brand hover:underline font-bold tracking-wider uppercase text-[11px]"
          >
            Reset all filters
          </button>
        )}
      </div>

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
