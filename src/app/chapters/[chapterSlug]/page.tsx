import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { EventCard } from "@/components/event-card";
import { Reveal } from "@/components/reveal";

type ChapterPageProps = {
  params: Promise<{ chapterSlug: string }>;
};

async function fetchChapter(slug: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/chapters/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function fetchChapterEvents(chapterSlug: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/events?chapter=${chapterSlug}`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch("http://localhost:5000/api/chapters");
    if (!res.ok) return [];
    const chapters = await res.json();
    return chapters.map((chapter: any) => ({ chapterSlug: chapter.slug }));
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { chapterSlug } = await params;
  const chapter = await fetchChapter(chapterSlug);
  if (!chapter) return {};
  return {
    title: chapter.name,
    description: `${chapter.college} events featured on RAS Connect.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  const chapter = await fetchChapter(chapterSlug);
  if (!chapter) notFound();

  const events = await fetchChapterEvents(chapter.slug);
  const currentEvents = events.filter((event: any) => !event.archived);
  const archivedEvents = events.filter((event: any) => event.archived);

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
