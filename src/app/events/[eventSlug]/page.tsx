import { getPublicEvent } from "@/lib/content";
import { resolveMediaUrl } from "@/config/api";
import type { Metadata } from "next";
import { EventPageClient } from "./EventPageClient";
type Props = { params: Promise<{ eventSlug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventSlug } = await params;
  const record = await getPublicEvent(eventSlug);
  const description = record.description.join(" ");
  const url = `/events/${encodeURIComponent(eventSlug)}/`;
  const image = resolveMediaUrl(record.image);
  return {
    title: record.name, description: description.slice(0, 160), alternates: { canonical: url },
    openGraph: { title: record.name, description: description.slice(0, 160), url, images: [{ url: image, alt: record.name }] },
    twitter: { card: "summary_large_image", title: record.name, images: [image] }
  };
}
export default async function Page({ params }: Props) {
  const { eventSlug } = await params;
  const initialEvent = await getPublicEvent(eventSlug);
  return <EventPageClient eventSlug={eventSlug} initialEvent={initialEvent} />;
}
