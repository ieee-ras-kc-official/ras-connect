import { apiList, SITE_URL } from "@/config/api";
import type { Chapter, RasEvent } from "@/types/api";
import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [chapters, events] = await Promise.all([apiList<Chapter>("/api/chapters", { cache: "no-store" }), apiList<RasEvent>("/api/events", { cache: "no-store" })]);
  return [
    ...["", "events", "chapters", "archive"].map(path => ({ url: `${SITE_URL}/${path ? path + "/" : ""}` })),
    ...chapters.map(record => ({ url: `${SITE_URL}/chapters/${encodeURIComponent(record.slug)}/`, ...(record.updatedAt ? { lastModified: record.updatedAt } : {}) })),
    ...events.filter(record => record.status === "verified").map(record => ({ url: `${SITE_URL}/events/${encodeURIComponent(record.slug)}/`, ...(record.updatedAt ? { lastModified: record.updatedAt } : {}) })),
  ];
}
