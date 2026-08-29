import type { Metadata } from "next";
import { EventsPageClient } from "./EventsPageClient";

export const metadata: Metadata = {
  title: "Robotics Events & Workshops in Kerala",
  description:
    "Explore upcoming and completed robotics events, hands-on automation workshops, hackathons, and seminars hosted by IEEE RAS Student Branch Chapters.",
};

export default function EventsPage() {
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
        <EventsPageClient />
      </div>
    </section>
  );
}
