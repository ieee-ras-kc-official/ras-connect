"use client";

import { useToast } from "@/components/toast";
import { API_BASE_URL, errorMessage, readJson } from "@/config/api";
import { PencilSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type ClusterDetails = {
  number: number;
  lead: string;
  subcom: string;
  hub: string;
};

type ClusterChapter = {
  slug: string;
  name: string;
  college: string;
  cluster?: number | null;
};

const HUBS = ["KOCHI", "MALABAR", "TRAVANCORE"];

const labelClass = "font-mono text-[10px] uppercase tracking-widest text-muted block mb-1";
const inputClass =
  "w-full bg-transparent py-1.5 border-b border-line text-sm text-ink outline-none focus:border-brand";

function MemberRow({
  chapter,
  clusterNumbers,
  onMove,
}: {
  chapter: ClusterChapter;
  clusterNumbers: number[];
  onMove: (chapter: ClusterChapter, cluster: string) => void;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-t border-line py-2 first:border-t-0">
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">{chapter.name}</p>
        <p className="text-xs text-muted">{chapter.college}</p>
      </div>
      <select
        aria-label={`Cluster for ${chapter.name}`}
        value={chapter.cluster ?? ""}
        onChange={(e) => onMove(chapter, e.target.value)}
        className="border border-line bg-surface px-2 py-1 font-mono text-[11px] text-ink outline-none focus:border-brand"
      >
        <option value="">No cluster</option>
        {clusterNumbers.map((number) => (
          <option key={number} value={number}>
            Cluster {number}
          </option>
        ))}
      </select>
    </li>
  );
}

function ClusterCard({
  cluster,
  members,
  clusterNumbers,
  onMove,
  onSaved,
}: {
  cluster: ClusterDetails;
  members: ClusterChapter[];
  clusterNumbers: number[];
  onMove: (chapter: ClusterChapter, value: string) => void;
  onSaved: (updated: ClusterDetails) => void;
}) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cluster);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/clusters/${cluster.number}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ lead: draft.lead, subcom: draft.subcom, hub: draft.hub }),
      });
      const data = await readJson<{ success: boolean; cluster: ClusterDetails; message?: string; error?: string }>(res);
      if (res.ok && data.success) {
        onSaved(data.cluster);
        setEditing(false);
        toast.success(`Cluster ${cluster.number} updated.`);
      } else {
        toast.error(data.message || data.error || "Failed to update cluster.");
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold uppercase text-ink">Cluster {cluster.number}</h3>
          {cluster.hub && (
            <span className="border border-line bg-surface-soft px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-brand">
              {cluster.hub}
            </span>
          )}
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(cluster);
              setEditing(true);
            }}
            aria-label={`Edit cluster ${cluster.number}`}
            className="flex size-8 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <PencilSimple size={15} />
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={save} className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`lead-${cluster.number}`} className={labelClass}>
                Lead
              </label>
              <input
                id={`lead-${cluster.number}`}
                type="text"
                value={draft.lead}
                onChange={(e) => setDraft({ ...draft, lead: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor={`hub-${cluster.number}`} className={labelClass}>
                Hub
              </label>
              <select
                id={`hub-${cluster.number}`}
                value={draft.hub}
                onChange={(e) => setDraft({ ...draft, hub: e.target.value })}
                className={inputClass}
              >
                <option value="">No hub</option>
                {HUBS.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`subcom-${cluster.number}`} className={labelClass}>
              Subcom
            </label>
            <input
              id={`subcom-${cluster.number}`}
              type="text"
              value={draft.subcom}
              onChange={(e) => setDraft({ ...draft, subcom: e.target.value })}
              placeholder="Names, separated by commas"
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white transition-colors hover:bg-brand disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border border-line px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-muted transition-colors hover:bg-surface-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-4">
          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted sm:pt-0.5">Lead</dt>
          <dd className="font-bold text-ink">{cluster.lead || "Not set"}</dd>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted sm:pt-0.5">Subcom</dt>
          <dd className="text-muted">{cluster.subcom || "Not set"}</dd>
        </dl>
      )}

      <div className="mt-3 border-t border-line pt-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Colleges ({members.length})
        </p>
        {members.length === 0 ? (
          <p className="mt-2 text-xs text-muted">No colleges in this cluster.</p>
        ) : (
          <ul className="mt-1">
            {members.map((chapter) => (
              <MemberRow key={chapter.slug} chapter={chapter} clusterNumbers={clusterNumbers} onMove={onMove} />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ClusterManagerPanel({
  chapters,
  onChaptersChanged,
}: {
  chapters: ClusterChapter[];
  onChaptersChanged: () => Promise<void>;
}) {
  const toast = useToast();
  const [clusters, setClusters] = useState<ClusterDetails[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/clusters`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => readJson<ClusterDetails[]>(res))
      .then(setClusters)
      .catch((error) => setLoadError(errorMessage(error)));
  }, [retry]);

  const moveChapter = async (chapter: ClusterChapter, value: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chapters/${encodeURIComponent(chapter.slug)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ cluster: value }),
      });
      const data = await readJson<{ success: boolean; message?: string; error?: string }>(res);
      if (res.ok && data.success) {
        await onChaptersChanged();
        toast.success(value ? `${chapter.name} moved to Cluster ${value}.` : `${chapter.name} removed from its cluster.`);
      } else {
        toast.error(data.message || data.error || "Failed to move college.");
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  if (loadError) return <div role="alert" className="border border-red-500 p-4"><p>{loadError}</p><button className="min-h-11 underline" onClick={() => { setLoadError(""); setRetry(value => value + 1); }}>Retry loading clusters</button></div>;
  if (clusters === null) {
    return <p className="font-mono text-xs text-muted">Loading clusters...</p>;
  }

  const clusterNumbers = clusters.map((cluster) => cluster.number);
  const unassigned = chapters.filter((chapter) => !chapter.cluster);

  return (
    <div className="space-y-4">
      <div className="border-b border-line pb-2">
        <h2 className="text-xl font-bold uppercase tracking-tight text-ink">Clusters</h2>
        <p className="mt-1 text-xs leading-5 text-muted">
          Moving a college changes how many colleges count as &quot;all colleges&quot; for that cluster from now on.
          Points already awarded stay the same unless the feedback is verified again.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {clusters.map((cluster) => (
          <ClusterCard
            key={cluster.number}
            cluster={cluster}
            members={chapters.filter((chapter) => chapter.cluster === cluster.number)}
            clusterNumbers={clusterNumbers}
            onMove={moveChapter}
            onSaved={(updated) =>
              setClusters((current) =>
                (current ?? []).map((item) => (item.number === updated.number ? updated : item))
              )
            }
          />
        ))}
      </div>

      {unassigned.length > 0 && (
        <section className="border border-line bg-surface p-4" aria-labelledby="unassigned-heading">
          <h3 id="unassigned-heading" className="text-base font-bold uppercase text-ink">
            No Cluster ({unassigned.length})
          </h3>
          <p className="mt-1 text-xs text-muted">These chapters are not on the leaderboard.</p>
          <ul className="mt-2">
            {unassigned.map((chapter) => (
              <MemberRow key={chapter.slug} chapter={chapter} clusterNumbers={clusterNumbers} onMove={moveChapter} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
