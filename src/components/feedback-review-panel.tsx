"use client";

import { useToast } from "@/components/toast";
import { API_BASE_URL, errorMessage, readJson } from "@/config/api";
import { STATUS_BADGE, type Feedback, type FeedbackStatus } from "@/utils/feedback";
import Link from "next/link";
import { useEffect, useState } from "react";

import { EvidenceLink } from "@/components/evidence-link";

type ReviewChapter = {
  _id: string;
  slug: string;
  name: string;
  cluster?: number | null;
};

const FILTERS: FeedbackStatus[] = ["pending", "verified", "rejected"];

const labelClass = "font-mono text-[10px] uppercase tracking-widest text-muted block mb-1";
const inputClass =
  "w-full bg-transparent py-1.5 border-b border-line text-sm text-ink outline-none focus:border-brand";

function ReviewCard({
  feedback,
  chapters,
  onReviewed,
}: {
  feedback: Feedback;
  chapters: ReviewChapter[];
  onReviewed: (updated: Feedback) => void;
}) {
  const toast = useToast();
  const [participants, setParticipants] = useState(String(feedback.participants));
  const [rasMembers, setRasMembers] = useState(String(feedback.rasMembers));
  const [collaborators, setCollaborators] = useState(feedback.collaboratingChapters.map((c) => c._id));
  const [reviewNote, setReviewNote] = useState(feedback.reviewNote);
  const [saving, setSaving] = useState(false);

  const host = chapters.find((chapter) => chapter.slug === feedback.event.chapterSlug);
  const peers = chapters.filter(
    (chapter) => host?.cluster && chapter.cluster === host.cluster && chapter.slug !== host.slug
  );

  const review = async (action: "verify" | "reject") => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/${feedback._id}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(
          action === "verify"
            ? { action, participants, rasMembers, collaboratingChapters: collaborators, reviewNote }
            : { action, reviewNote }
        ),
      });
      const data = await readJson<{ success: boolean; feedback: Feedback; message?: string; error?: string }>(res);
      if (res.ok && data.success) {
        toast.success(
          action === "verify" ? `Verified: ${data.feedback.points.total} points awarded.` : "Feedback rejected."
        );
        onReviewed(data.feedback);
      } else {
        toast.error(data.message || data.error || "Failed to review feedback.");
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="space-y-4 border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="border border-line bg-surface-soft px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-brand">
            {host?.name || feedback.event.chapterSlug} • Cluster {host?.cluster ?? "?"}
          </span>
          <h3 className="mt-2 text-base font-bold uppercase text-ink">
            <Link href={`/events/${feedback.event.slug}`} className="hover:text-brand">
              {feedback.event.name}
            </Link>
          </h3>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {feedback.event.date} • submitted by @{feedback.submittedBy}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${STATUS_BADGE[feedback.status]}`}
          >
            {feedback.status}
          </span>
          <p className="mt-2 font-mono text-2xl font-bold text-brand">{feedback.points.total}</p>
          <p className="font-mono text-[10px] text-muted">
            {feedback.points.collaboration} + {feedback.points.participants} + {feedback.points.rasMembers}
          </p>
        </div>
      </div>

      <p className="whitespace-pre-line text-sm leading-6 text-muted">{feedback.eventDetails}</p>

      <div>
        <span className={labelClass}>Screenshots / Photos</span>
        <div className="flex flex-wrap gap-2">
          {feedback.photos.map((photo) => (
            <EvidenceLink key={photo.url} attachment={photo} />
          ))}
        </div>
        <EvidenceLink attachment={feedback.attendance} />
      </div>

      <div className="space-y-3 border-t border-line pt-3">
        <p className="text-xs text-muted">
          Correct any figure that does not match the evidence. Points are recalculated when you verify.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`participants-${feedback._id}`} className={labelClass}>
              No. of Participants
            </label>
            <input
              id={`participants-${feedback._id}`}
              type="number"
              min={0}
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`ras-${feedback._id}`} className={labelClass}>
              No. of IEEE RAS Members
            </label>
            <input
              id={`ras-${feedback._id}`}
              type="number"
              min={0}
              value={rasMembers}
              onChange={(e) => setRasMembers(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {peers.length > 0 && (
          <div>
            <span className={labelClass}>Collaborating Colleges</span>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {peers.map((peer) => (
                <label key={peer._id} className="flex items-center gap-2 text-xs text-ink">
                  <input
                    type="checkbox"
                    checked={collaborators.includes(peer._id)}
                    onChange={(e) =>
                      setCollaborators((current) =>
                        e.target.checked ? [...current, peer._id] : current.filter((id) => id !== peer._id)
                      )
                    }
                    className="accent-brand"
                  />
                  {peer.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor={`note-${feedback._id}`} className={labelClass}>
            Note to Sub-Admin (Required to Reject)
          </label>
          <input
            id={`note-${feedback._id}`}
            type="text"
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="e.g. Attendance sheet shows 52 participants, not 62"
            className={inputClass}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => review("verify")}
            className="bg-emerald-600 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {feedback.status === "verified" ? "Save & Recalculate" : "Verify & Award Points"}
          </button>
          {feedback.status !== "rejected" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => review("reject")}
              className="bg-rose-600 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeedbackReviewPanel({ chapters }: { chapters: ReviewChapter[] }) {
  const [items, setItems] = useState<Feedback[] | null>(null);
  const [filter, setFilter] = useState<FeedbackStatus>("pending");
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feedback`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => readJson<Feedback[]>(res))
      .then(setItems)
      .catch((error) => setLoadError(errorMessage(error)));
  }, [retry]);

  const visible = (items ?? []).filter((item) => item.status === filter);

  return (
    <div className="space-y-4">
      <h2 className="border-b border-line pb-2 text-xl font-bold uppercase tracking-tight text-ink">
        Feedback Review
      </h2>
      {loadError && <div role="alert" className="border border-red-500 p-4"><p>{loadError}</p><button className="min-h-11 underline" onClick={() => { setLoadError(""); setRetry(value => value + 1); }}>Retry loading feedback</button></div>}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            aria-pressed={filter === status}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${filter === status ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-ink"
              }`}
          >
            {status} ({(items ?? []).filter((item) => item.status === status).length})
          </button>
        ))}
      </div>

      {items === null ? (
        <p className="font-mono text-xs text-muted">Loading submissions...</p>
      ) : visible.length === 0 ? (
        <p className="font-mono text-xs text-muted">No {filter} submissions.</p>
      ) : (
        visible.map((item) => (
          <ReviewCard
            key={`${item._id}-${item.status}`}
            feedback={item}
            chapters={chapters}
            onReviewed={(updated) =>
              setItems((current) =>
                (current ?? []).map((entry) => (entry._id === updated._id ? updated : entry))
              )
            }
          />
        ))
      )}
    </div>
  );
}
