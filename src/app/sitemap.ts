import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/config/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rasconnect.ieee-ras-kerala.org";

  // Base routes
  const routes = ["", "/events", "/chapters", "/archive"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Chapters URLs for search engine indexation
  let chapterUrls: any[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters`, { cache: "no-store" });
    if (res.ok) {
      const chapters = await res.json();
      chapterUrls = chapters.map((chapter: any) => ({
        url: `${baseUrl}/chapters/${chapter.slug}`,
        lastModified: new Date(chapter.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    // Ignore fetch failure
  }

  // Dynamic Events URLs for search engine indexation
  let eventUrls: any[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, { cache: "no-store" });
    if (res.ok) {
      const events = await res.json();
      eventUrls = events.map((event: any) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    // Ignore fetch failure
  }

  return [...routes, ...chapterUrls, ...eventUrls];
}
