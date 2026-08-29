import type { Metadata } from "next";
import { EventPageClient } from "./EventPageClient";
import { API_BASE_URL } from "@/config/api";

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

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`);
    if (!res.ok) return [];
    const events = await res.json();
    return events.map((event: any) => ({ eventSlug: event.slug }));
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = await fetchEvent(eventSlug);
  if (!event) return {};
  return {
    title: event.name,
    description: event.description && event.description[0] ? event.description[0] : "",
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params;
  return <EventPageClient eventSlug={eventSlug} />;
}
