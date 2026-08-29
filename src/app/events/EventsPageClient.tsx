"use client";

import { useEffect, useState } from "react";
import { EventSearch } from "@/components/event-search";
import { API_BASE_URL } from "@/config/api";

function SearchFallback() {
  return (
    <div className="mt-12 animate-pulse">
      <div className="h-5 w-48 bg-surface-strong" />
      <div className="mt-2 h-13 max-w-2xl bg-surface-strong" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-64 bg-surface-strong" />
        ))}
      </div>
    </div>
  );
}

import { isEventPassed } from "@/utils/date";

export function EventsPageClient() {
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
        console.error("Failed to load live data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <SearchFallback />;
  }

  const activeEvents = events.filter((event: any) => {
    const dateStr = typeof event.date === "string" 
      ? event.date 
      : event.date?.label || "";
    return !event.archived && !isEventPassed(dateStr);
  });

  return <EventSearch events={activeEvents} chapters={chapters} />;
}
