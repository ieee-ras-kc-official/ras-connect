"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { ChapterExplorer } from "@/components/chapter-explorer";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { EventCard } from "@/components/event-card";
import { LeaderboardSection } from "@/components/leaderboard-section";
import { API_BASE_URL } from "@/config/api";
import { isEventPassed } from "@/utils/date";

function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background select-none">
      <div className="flex flex-col items-center text-center">
        {/* Slashed design logo in preloader */}
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-[-0.04em] text-ink select-none animate-pulse flex flex-col items-center">
          <span className="flex items-center">
            RAS<span className="text-brand font-mono font-light mx-1">/</span>
          </span>
          <span className="text-brand-deep">CONNECT<span className="text-accent font-sans">.</span></span>
        </h1>
        {/* Subtitle / Loader bar */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            SYNCING WITH NETWORK
          </span>
          <div className="h-[2px] w-24 bg-line overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 bg-brand w-1/2 animate-[loading_1.5s_infinite_ease-in-out]" />
          </div>
        </div>
      </div>
      {/* Dynamic inline styles for the preloader slider animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}} />
    </div>
  );
}

export default function HomePage() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [heroEvents, setHeroEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      try {
        const [chaptersRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/chapters`),
          fetch(`${API_BASE_URL}/api/events`)
        ]);

        if (chaptersRes.ok && eventsRes.ok) {
          const chaptersData = await chaptersRes.json();
          const eventsData = await eventsRes.json();

          const activeEvents = eventsData.filter((event: { archived?: boolean }) => !event.archived);

          setChapters(chaptersData);
          setLatestEvents(activeEvents.slice(0, 8));
          const featured = activeEvents.filter((e: { isFeatured?: boolean; featured?: boolean }) => e.isFeatured || e.featured);
          setHeroEvents(featured.length > 0 ? featured.slice(0, 5) : activeEvents.slice(0, 5));
        }
      } catch {
        console.error("Failed to load initial data");
      } finally {
        // Small timeout for smooth preloader exit transition
        setTimeout(() => setLoading(false), 800);
      }
    }
    initData();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  const featuredChapters = chapters.slice(0, 5);

  return (
    <>
      <HomeHero events={heroEvents} chaptersCount={chapters.length} eventsCount={latestEvents.length} />

      {/* About RAS Connect Section */}
      <section className="section-space bg-background border-b border-line" aria-labelledby="about-heading">
        <div className="page-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Side: Tag and Title */}
            <div className="lg:col-span-4">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="inline-block size-2 bg-brand rounded-none shrink-0" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    ABOUT
                  </span>
                </div>
                <h2
                  id="about-heading"
                  className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl flex flex-col select-none"
                >
                  <span className="flex items-center">
                    RAS<span className="text-brand font-mono font-light mx-1">/</span>
                  </span>
                  <span className="text-brand-deep">CONNECT<span className="text-accent font-sans">.</span></span>
                </h2>
              </Reveal>
            </div>

            {/* Right Side: Description Narrative */}
            <div className="lg:col-span-8 flex flex-col">
              <Reveal delay={0.1}>
                <p className="text-pretty text-lg font-medium leading-relaxed text-ink/90 md:text-xl">
                  Initiated in connection with <span className="text-brand font-bold">IEEE RAS Day</span>, RAS Connect is a statewide digital ecosystem designed to bridge, showcase, and synergize the initiatives of IEEE Robotics & Automation Society (RAS) Student Branch Chapters across Kerala.
                </p>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
                  The platform serves as an interactive catalog and showcase, documenting local events, technical milestones, and collaborative projects. By consolidating student branch updates into a single public directory, RAS Connect fosters peer-to-peer learning, enhances state-wide community outreach, and highlights Kerala&apos;s growing ecosystem of robotics education.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

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

      <LeaderboardSection />

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
