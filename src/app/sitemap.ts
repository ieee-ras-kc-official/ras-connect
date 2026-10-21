import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/config/api";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ras-connect.ras.ieeekerala.org";

  // Base routes
  const routes = ["", "/events", "/chapters", "/archive"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Chapters URLs for search engine indexation
  let chapterUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapters`, { cache: "no-store" });
    if (res.ok) {
      const chapters = await res.json();
      chapterUrls = chapters.map((chapter: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/chapters/${chapter.slug}`,
        lastModified: new Date(chapter.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Ignore fetch failure
  }

  // Dynamic Events URLs for search engine indexation
  let eventUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, { cache: "no-store" });
    if (res.ok) {
      const events = await res.json();
      eventUrls = events.map((event: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Ignore fetch failure
  }

  return [...routes, ...chapterUrls, ...eventUrls];
}
