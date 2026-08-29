import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { ChapterExplorer } from "@/components/chapter-explorer";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { EventCard } from "@/components/event-card";

export const metadata: Metadata = {
  title: "Robotics events across Kerala",
};

async function getChapters() {
  try {
    const res = await fetch("http://localhost:5000/api/chapters", { cache: "no-store" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getHeroEvents() {
  try {
    const res = await fetch("http://localhost:5000/api/events?featured=true&limit=5", { cache: "no-store" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getLatestEvents() {
  try {
    const res = await fetch("http://localhost:5000/api/events?limit=10", { cache: "no-store" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [];
  }
}

export default async function HomePage() {
  const chapters = await getChapters();
  const heroEvents = await getHeroEvents();
  const latestEvents = await getLatestEvents();

  const featuredChapters = chapters.slice(0, 5);

  return (
    <>
      <HomeHero events={heroEvents} chaptersCount={chapters.length} eventsCount={latestEvents.length} />

      {/* Explore All Events Section */}
      <section className="section-space bg-surface border-b border-line" aria-labelledby="events-heading">
        <div className="page-container">
          <Reveal>
            <div className="flex items-start justify-between gap-4">
              <h2
                id="events-heading"
                className="text-balance text-3xl font-bold tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl"
              >
                Explore All Events
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-brand/85 border border-line bg-background/40 px-2.5 py-1 select-none shrink-0 mt-1 sm:mt-2">
                <span>Scroll</span>
                <span className="font-bold text-accent">↔</span>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted md:text-lg">
              Browse workshops, hackathons, and exhibitions organized by the student communities.
            </p>
          </Reveal>
          
          <div className="relative mt-12">
            {/* Local style block to hide scrollbars cleanly */}
            <style dangerouslySetInnerHTML={{__html: `
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}} />

            {latestEvents.length > 0 ? (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 no-scrollbar">
                {latestEvents.map((event: any, index: number) => (
                  <div 
                    key={event.slug} 
                    className="shrink-0 w-[280px] sm:w-[320px] md:w-[calc((100%-24px*3)/4)] snap-start h-full"
                  >
                    <EventCard event={event} index={index} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-line p-8 bg-surface-soft text-center flex flex-col items-center justify-center min-h-[200px]">
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink mb-2">
                  No Events Logged
                </h3>
                <p className="text-sm text-muted">
                  No events have been published yet. Please check back later.
                </p>
              </div>
            )}
          </div>

          <Reveal className="mt-9">
            <Link
              href="/events"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-accent"
            >
              View all events
              <ArrowRightIcon size={18} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Explore Student Branch Chapters Section */}
      <section className="section-space bg-surface border-b border-line" aria-labelledby="chapters-heading">
        <div className="page-container">
          <Reveal>
            <div className="flex items-start justify-between gap-4">
              <h2
                id="chapters-heading"
                className="text-balance text-3xl font-bold tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl"
              >
                Explore Student Branch Chapters
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-brand/85 border border-line bg-background/40 px-2.5 py-1 select-none shrink-0 mt-1 sm:mt-2">
                <span>Scroll</span>
                <span className="font-bold text-accent">↔</span>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted md:text-lg">
              Start with a chapter, then discover the events its student community brought to life.
            </p>
          </Reveal>
          <ChapterExplorer chapters={featuredChapters} />
          <Reveal className="mt-9">
            <Link
              href="/chapters"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-accent"
            >
              View all chapters
              <ArrowRightIcon size={18} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

    </>
  );
}
