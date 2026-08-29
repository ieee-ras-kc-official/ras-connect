"use client";

import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useTransition } from "react";
import { ImageWithFallback } from "@/components/image-with-fallback";
import type { Chapter } from "@/data/mock-data";

export function ChapterSearch({ chapters }: { chapters: Chapter[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  const query = searchParams.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase();
    if (!normalized) return chapters;
    return chapters.filter((chapter) =>
      [chapter.name, chapter.college, chapter.location].some((value) =>
        value.toLocaleLowerCase().includes(normalized),
      ),
    );
  }, [chapters, deferredQuery]);

  const setQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value);
    else params.delete("q");
    const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router.replace(nextUrl, { scroll: false }));
  };

  return (
    <div className="mt-12">
      <div className="max-w-xl">
        <label
          htmlFor="chapter-search"
          className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted"
        >
          Search chapters or colleges
        </label>
        <div className="relative border-b border-line focus-within:border-brand transition-colors">
          <MagnifyingGlassIcon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="chapter-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a chapter or college name"
            autoComplete="off"
            className="w-full bg-transparent py-3.5 pl-7 pr-8 text-base text-ink outline-none placeholder:text-muted rounded-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear chapter search"
              className="absolute right-0 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-muted transition-colors hover:bg-surface-soft hover:text-brand rounded-none"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
 
      <p aria-live="polite" className="mt-5 font-mono text-xs text-muted">
        {isPending
          ? "Updating results"
          : `${results.length} ${results.length === 1 ? "chapter" : "chapters"}`}
      </p>
 
      {results.length ? (
        <motion.div layout className="mt-8 grid gap-x-10 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((chapter, index) => (
              <motion.div
                layout
                key={chapter.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{
                  duration: 0.28,
                  delay: reduceMotion ? 0 : Math.min(index, 3) * 0.035,
                  ease: [0.2, 0, 0, 1],
                }}
                className="border-b border-line"
              >
                <Link
                  href={`/chapters/${chapter.slug}`}
                  className="group grid grid-cols-[72px_1fr] items-center gap-4 py-4"
                >
                  <span className="relative block aspect-square w-[72px] overflow-hidden bg-surface-soft border border-line rounded-none">
                    <ImageWithFallback
                      src={chapter.image}
                      alt={chapter.imageAlt}
                      sizes="72px"
                      className="object-cover transition-transform duration-500 ease-brand motion-safe:group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-pretty text-base font-bold leading-tight text-ink transition-colors group-hover:text-brand uppercase tracking-tight">
                      {chapter.name}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] leading-normal text-muted uppercase tracking-wider">
                      {chapter.college}
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-8 grid min-h-64 place-items-center border border-dashed border-line bg-surface-soft/45 px-6 py-12 text-center rounded-none">
          <div>
            <span className="mx-auto grid size-12 place-items-center border border-line bg-surface text-brand rounded-none">
              <MagnifyingGlassIcon size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-ink">
              No chapters match that search.
            </h2>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 min-h-11 bg-brand px-5 text-sm font-bold text-white transition-[background-color,transform] hover:bg-brand-deep active:scale-[0.98] rounded-none"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
