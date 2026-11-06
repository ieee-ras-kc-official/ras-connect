"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Reveal } from "@/components/reveal";
import { API_BASE_URL } from "@/config/api";

type Standing = {
  rank: number;
  slug: string;
  name: string;
  college: string;
  logo: string;
  cluster: number;
  points: number;
  events: number;
  averageScore: number;
};

const DEFAULT_ICON = "/images/brand/default-chapter-icon.svg";

function RankCell({ standing }: { standing: Standing }) {
  if (standing.points === 0) {
    return <span className="text-muted">—</span>;
  }
  if (standing.rank <= 3) {
    return (
      <span className="inline-grid size-7 place-items-center bg-brand font-bold text-white">
        {standing.rank}
      </span>
    );
  }
  return <span className="font-bold text-ink">{standing.rank}</span>;
}

export function LeaderboardSection() {
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feedback/leaderboard`)
      .then((res) => {
        if (!res.ok) throw new Error("Leaderboard request failed");
        return res.json();
      })
      .then(setStandings)
      .catch(() => setFailed(true));
  }, []);

  const headCell = "px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted";

  return (
    <section id="leaderboard" className="section-space bg-background border-b border-line" aria-labelledby="leaderboard-heading">
      <div className="page-container">
        <Reveal>
          <h2
            id="leaderboard-heading"
            className="text-balance text-3xl font-bold tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl"
          >
            Leaderboard
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted md:text-lg">
            Student Branch Chapters ranked by the points earned from their verified events.
          </p>
        </Reveal>

        {standings && standings.length > 0 ? (
          <>
            <div
              role="region"
              aria-labelledby="leaderboard-heading"
              tabIndex={0}
              className="no-scrollbar mt-10 max-h-[640px] overflow-y-auto border border-line bg-surface"
            >
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 border-b border-line bg-surface-soft">
                  <tr>
                    <th scope="col" className={`${headCell} w-14 text-center`}>Rank</th>
                    <th scope="col" className={headCell}>Chapter</th>
                    <th scope="col" className={`${headCell} hidden text-center sm:table-cell`}>Cluster</th>
                    <th scope="col" className={`${headCell} hidden text-center sm:table-cell`}>Events</th>
                    <th scope="col" className={`${headCell} hidden text-center md:table-cell`}>Avg Score</th>
                    <th scope="col" className={`${headCell} text-right`}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing) => (
                    <tr key={standing.slug} className="border-b border-line last:border-b-0">
                      <td className="px-3 py-3 text-center font-mono text-sm">
                        <RankCell standing={standing} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 shrink-0 overflow-hidden border border-line bg-surface-soft p-1">
                            <ImageWithFallback
                              src={standing.logo && standing.logo !== "/card1.jpeg" ? standing.logo : DEFAULT_ICON}
                              fallbackSrc={DEFAULT_ICON}
                              alt=""
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/chapters/${standing.slug}`}
                              className="block text-sm font-bold text-ink transition-colors hover:text-brand"
                            >
                              {standing.name}
                            </Link>
                            <p className="mt-0.5 text-xs text-muted">{standing.college}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 text-center font-mono text-sm text-muted sm:table-cell">
                        {standing.cluster}
                      </td>
                      <td className="hidden px-3 py-3 text-center font-mono text-sm text-muted sm:table-cell">
                        {standing.events}
                      </td>
                      <td className="hidden px-3 py-3 text-center font-mono text-sm text-muted md:table-cell">
                        {standing.averageScore.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-base font-bold text-brand">
                        {standing.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Avg Score is the average of the three scoring categories across a chapter&apos;s verified events.
            </p>
          </>
        ) : (
          <div className="mt-10 flex min-h-[160px] items-center justify-center border border-line bg-surface p-8 text-center">
            <p className="text-sm text-muted">
              {failed
                ? "The leaderboard could not be loaded. Please try again later."
                : standings
                ? "Standings will appear here once chapters are assigned to clusters."
                : "Loading standings..."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
