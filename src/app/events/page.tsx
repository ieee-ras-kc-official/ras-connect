import type { Metadata } from "next";
import { Suspense } from "react";
import { EventSearch } from "@/components/event-search";
import { API_BASE_URL } from "@/config/api";

export const metadata: Metadata = {
  title: "Robotics Events & Workshops in Kerala",
  description:
    "Explore upcoming and completed robotics events, hands-on automation workshops, hackathons, and seminars hosted by IEEE RAS Student Branch Chapters.",
};

async function getChapters() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getEvents() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [];
  }
}

function SearchFallback() {
  return (
    <div className="mt-12 animate-pulse">
      <div className="h-5 w-48 bg-surface-strong" />
      <div className="mt-2 h-13 max-w-2xl bg-surface-strong" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-64 bg-surface-strong" />
        ))}
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const chapters = await getChapters();
  const events = await getEvents();

  return (
    <section className="min-h-[calc(100dvh-var(--header-height))] py-16 md:py-24">
      <div className="page-container">
        <div className="max-w-3xl">
          <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] text-brand sm:text-5xl lg:text-6xl">
            All Events
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted">
            Explore active workshops, exhibitions, and bootcamps hosted by SBCs across Kerala.
          </p>
        </div>
        <Suspense fallback={<SearchFallback />}>
          <EventSearch events={events} chapters={chapters} />
        </Suspense>
      </div>
    </section>
  );
}
