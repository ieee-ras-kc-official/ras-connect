import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/config/api";
import { chapters as fallbackChapters, events as fallbackEvents } from "@/data/mock-data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://connect.ras.ieeekerala.org";

  // Base routes
  const routes = ["", "/events", "/chapters", "/archive"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  // Dynamic Chapters URLs for search engine indexation
  let chaptersList: any[] = fallbackChapters;
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        chaptersList = data;
      }
    }
  } catch {
    // Use fallback
  }

  const seenChapterSlugs = new Set<string>();
  const chapterUrls: MetadataRoute.Sitemap = [];
  for (const chapter of chaptersList) {
    if (chapter.slug && !seenChapterSlugs.has(chapter.slug)) {
      seenChapterSlugs.add(chapter.slug);
      chapterUrls.push({
        url: `${baseUrl}/chapters/${chapter.slug}`,
        lastModified: new Date(chapter.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  // Dynamic Events URLs for search engine indexation
  let eventsList: any[] = fallbackEvents;
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        eventsList = data;
      }
    }
  } catch {
    // Use fallback
  }

  const seenEventSlugs = new Set<string>();
  const eventUrls: MetadataRoute.Sitemap = [];
  for (const event of eventsList) {
    if (event.slug && !seenEventSlugs.has(event.slug)) {
      seenEventSlugs.add(event.slug);
      eventUrls.push({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

  return [...routes, ...chapterUrls, ...eventUrls];
}
