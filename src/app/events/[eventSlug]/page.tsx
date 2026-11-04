import type { Metadata } from "next";
import { EventPageClient } from "./EventPageClient";
import { API_BASE_URL } from "@/config/api";
import { EVENT_FALLBACK_SLUG } from "@/config/routes";
import { events as fallbackEvents } from "@/data/mock-data";

type EventPageProps = {
  params: Promise<{ eventSlug: string }>;
};

async function fetchEvent(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function fetchEventSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`);
    if (!res.ok) throw new Error("Fetch failed");
    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) {
      return fallbackEvents.map((event) => event.slug);
    }
    return events.map((event: any) => event.slug);
  } catch (err) {
    return fallbackEvents.map((event) => event.slug);
  }
}

export async function generateStaticParams() {
  const slugs = await fetchEventSlugs();
  return [...slugs, EVENT_FALLBACK_SLUG].map((eventSlug) => ({ eventSlug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  if (eventSlug === EVENT_FALLBACK_SLUG) {
    return { title: "Event | RAS Connect IEEE", robots: { index: false } };
  }
  let event = await fetchEvent(eventSlug);
  if (!event) {
    event = fallbackEvents.find((e) => e.slug === eventSlug);
  }
  if (!event) return { title: "Event Not Found | RAS Connect IEEE" };

  const desc = Array.isArray(event.description)
    ? event.description.join(" ")
    : typeof event.description === "string"
    ? event.description
    : "Robotics and automation event documented on RAS Connect IEEE.";
  const title = `${event.name} | RAS Connect IEEE`;
  const url = `https://connect.ras.ieeekerala.org/events/${eventSlug}`;
  const posterUrl = event.image
    ? event.image.startsWith("http")
      ? event.image
      : `https://connect.ras.ieeekerala.org${event.image}`
    : "https://connect.ras.ieeekerala.org/card1.jpeg";

  return {
    title,
    description: desc.slice(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc.slice(0, 160),
      url,
      siteName: "RAS Connect IEEE",
      images: [
        {
          url: posterUrl,
          alt: `${event.name} Poster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc.slice(0, 160),
      images: [posterUrl],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params;
  return <EventPageClient eventSlug={eventSlug} />;
}
