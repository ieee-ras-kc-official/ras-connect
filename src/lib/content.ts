import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/config/api";
import type { Chapter, RasEvent } from "@/types/api";
async function record<T>(collection: string, slug: string): Promise<T> {
  try { return await apiFetch<T>(`/api/${collection}/${encodeURIComponent(slug)}`, { cache: "no-store" }); }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
}
export const getPublicEvent = cache((slug: string) => record<RasEvent>("events", slug));
export const getPublicChapter = cache((slug: string) => record<Chapter>("chapters", slug));
