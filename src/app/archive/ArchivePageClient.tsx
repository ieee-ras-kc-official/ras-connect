"use client";

import { useEffect, useState } from "react";
import { ArchiveBrowser } from "@/components/archive-browser";
import { API_BASE_URL } from "@/config/api";

function ArchiveFallback() {
  return (
    <div className="mt-12 animate-pulse">
      <div className="h-36 rounded-[14px] bg-surface-strong" />
      <div className="mt-14 h-10 w-28 rounded bg-surface-strong" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[16/10] rounded-[14px] bg-surface-strong" />
            <div className="mt-4 h-6 w-3/4 rounded bg-surface-strong" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { isEventPassed } from "@/utils/date";

export function ArchivePageClient() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [chaptersRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/chapters`),
          fetch(`${API_BASE_URL}/api/events`)
        ]);
        if (chaptersRes.ok && eventsRes.ok) {
          setChapters(await chaptersRes.json());
          setEvents(await eventsRes.json());
        }
      } catch (err) {
        console.error("Failed to load archive live:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <ArchiveFallback />;
  }

  const archivedEvents = events.filter((event: any) => {
    const dateStr = typeof event.date === "string" 
      ? event.date 
      : event.date?.label || "";
    return event.archived || isEventPassed(dateStr);
  });

  return <ArchiveBrowser events={archivedEvents} chapters={chapters} />;
}
