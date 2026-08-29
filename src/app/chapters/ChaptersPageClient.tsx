"use client";

import { useEffect, useState } from "react";
import { ChapterSearch } from "@/components/chapter-search";
import { API_BASE_URL } from "@/config/api";

function SearchFallback() {
  return (
    <div className="mt-12 animate-pulse">
      <div className="h-5 w-48 rounded bg-surface-strong" />
      <div className="mt-2 h-13 max-w-2xl rounded-[10px] bg-surface-strong" />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-[14px] bg-surface-strong" />
        ))}
      </div>
    </div>
  );
}

export function ChaptersPageClient() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chapters`);
        if (res.ok) {
          setChapters(await res.json());
        }
      } catch (err) {
        console.error("Failed to load chapters live:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <SearchFallback />;
  }

  return <ChapterSearch chapters={chapters} />;
}
