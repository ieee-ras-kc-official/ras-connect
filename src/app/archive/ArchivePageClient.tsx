"use client";
import { ArchiveBrowser } from "@/components/archive-browser";
import { apiList } from "@/config/api";
import type { Chapter, RasEvent } from "@/types/api";
import { isEventPassed } from "@/utils/date";
import { useEffect, useState } from "react";
export function ArchivePageClient() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [events, setEvents] = useState<RasEvent[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all([apiList<Chapter>("/api/chapters"), apiList<RasEvent>("/api/events")])
      .then(([chapters, events]) => { if (!cancelled) { setChapters(chapters); setEvents(events); setError(""); } })
      .catch(() => { if (!cancelled) setError("Unable to load archive. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);
  if (loading) return <p role="status" className="py-12">Loading archive…</p>;
  if (error) return <div role="alert" className="py-12"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)}>Retry</button></div>;
  return <ArchiveBrowser events={events.filter(event => isEventPassed(event.date))} chapters={chapters} />;
}
