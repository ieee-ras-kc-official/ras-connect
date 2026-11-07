"use client";
import { ChapterSearch } from "@/components/chapter-search";
import { apiList } from "@/config/api";
import type { Chapter } from "@/types/api";
import { useEffect, useState } from "react";

export function ChaptersPageClient() {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all([apiList<Chapter>("/api/chapters")])
      .then(([chapters]) => { if (!cancelled) { setChapters(chapters); setError(""); } })
      .catch(() => { if (!cancelled) setError("Unable to load chapters. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);
  if (loading) return <p role="status" className="py-12">Loading chapters…</p>;
  if (error) return <div role="alert" className="py-12"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)}>Retry</button></div>;
  return <ChapterSearch chapters={chapters} />;
}
