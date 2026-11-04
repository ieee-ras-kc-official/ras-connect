"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, X } from "@phosphor-icons/react";
import { useToast } from "@/components/toast";
import { API_BASE_URL } from "@/config/api";
import {
  attachmentUrl,
  STATUS_BADGE,
  type Attachment,
  type CollaboratingChapter,
  type Feedback,
} from "@/utils/feedback";

type FormContext = {
  eventName: string;
  eventStatus: string;
  chapterName: string;
  college: string;
  cluster: number | null;
  clusterChapters: CollaboratingChapter[];
  feedback: Omit<Feedback, "event"> | null;
};

const MAX_PHOTOS = 10;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const SCOREBOARD = [
  {
    title: "Event Conduction and Collaboration",
    lines: [
      "All colleges in the cluster jointly conduct the event - 10 points",
      "Only some colleges in the cluster are involved - 7.5 points",
      "Event conducted by an individual college - 5 points",
    ],
  },
  {
    title: "Participant Count",
    lines: ["40–60 participants - 5 points", "61–80 participants - 6 points"],
  },
  {
    title: "IEEE RAS Member Participation",
    lines: [
      "More than 5 IEEE RAS members participate - 3 points",
      "5 or fewer IEEE RAS members participate - no bonus points",
    ],
  },
];

const labelClass = "font-mono text-[10px] uppercase tracking-widest text-muted block mb-1";
const inputClass =
  "w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none";
const headingClass = "text-sm font-bold uppercase tracking-tight text-ink border-l-2 border-brand pl-2";

function AttachmentChip({ attachment, onRemove }: { attachment: Attachment; onRemove: () => void }) {
  return (
    <li className="flex items-center justify-between gap-3 border border-line bg-surface-soft px-3 py-2 text-xs">
      <a
        href={attachmentUrl(attachment.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 truncate font-mono text-brand hover:underline"
      >
        {attachment.name || "Attachment"}
      </a>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${attachment.name}`}
        className="shrink-0 text-muted transition-colors hover:text-rose-600"
      >
        <X size={14} />
      </button>
    </li>
  );
}

function FilePicker({
  id,
  label,
  hint,
  accept,
  multiple,
  busy,
  onFiles,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  busy: boolean;
  onFiles: (files: File[]) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative flex flex-col items-center gap-1 border border-dashed border-brand/50 p-4 text-center transition-colors hover:bg-surface-soft">
        <Paperclip size={20} className="text-brand" aria-hidden="true" />
        <span className="font-mono text-xs text-muted">{busy ? "Uploading..." : hint}</span>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={busy}
          onChange={(e) => {
            onFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

function PointsSummary({ feedback }: { feedback: NonNullable<FormContext["feedback"]> }) {
  const rows = [
    ["Collaboration", feedback.points.collaboration],
    ["Participants", feedback.points.participants],
    ["IEEE RAS members", feedback.points.rasMembers],
  ] as const;
  return (
    <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
      {rows.map(([label, value]) => (
        <div key={label} className="bg-surface p-3">
          <dt className="font-mono text-[9px] uppercase tracking-widest text-muted">{label}</dt>
          <dd className="mt-1 font-mono text-lg font-bold text-ink">{value}</dd>
        </div>
      ))}
      <div className="bg-surface p-3">
        <dt className="font-mono text-[9px] uppercase tracking-widest text-muted">Total</dt>
        <dd className="mt-1 font-mono text-lg font-bold text-brand">{feedback.points.total}</dd>
      </div>
    </dl>
  );
}

// Rendered on the event page. Only the host chapter's signed-in sub-admin ever sees it.
export function EventFeedbackForm({ eventSlug }: { eventSlug: string }) {
  const toast = useToast();
  const sectionRef = useRef<HTMLElement>(null);
  const [context, setContext] = useState<FormContext | null>(null);
  const [eventDetails, setEventDetails] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [participants, setParticipants] = useState("");
  const [rasMembers, setRasMembers] = useState("");
  const [photos, setPhotos] = useState<Attachment[]>([]);
  const [attendance, setAttendance] = useState<Attachment | null>(null);
  const [uploading, setUploading] = useState<"photo" | "attendance" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch(`${API_BASE_URL}/api/feedback/event/${eventSlug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: FormContext | null) => {
        if (!data) return;
        setContext(data);
        const saved = data.feedback;
        if (saved) {
          setEventDetails(saved.eventDetails);
          setCollaborators(saved.collaboratingChapters.map((chapter) => chapter._id));
          setParticipants(String(saved.participants));
          setRasMembers(String(saved.rasMembers));
          setPhotos(saved.photos);
          setAttendance(saved.attendance);
        }
      })
      .catch((err) => console.error("Failed to load feedback form:", err));
  }, [eventSlug]);

  const loaded = Boolean(context);
  useEffect(() => {
    if (loaded && window.location.hash === "#feedback") {
      sectionRef.current?.scrollIntoView();
    }
  }, [loaded]);

  if (!context) return null;

  const uploadFile = async (file: File, kind: "photo" | "attendance") => {
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`${file.name} is over 5MB.`);
      return null;
    }
    const auth = { Authorization: `Bearer ${localStorage.getItem("admin_token")}` };
    try {
      const signRes = await fetch(`${API_BASE_URL}/api/feedback/upload-signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ kind, fileName: file.name }),
      });
      const signed = await signRes.json();
      if (!signRes.ok) {
        toast.error(signed.error || `Failed to upload ${file.name}.`);
        return null;
      }

      const formData = new FormData();
      if (signed.direct) {
        // The file goes straight to Cloudinary, since Vercel rejects bodies over 4.5MB.
        Object.entries(signed.params).forEach(([key, value]) => formData.append(key, String(value)));
        formData.append("api_key", signed.apiKey);
        formData.append("signature", signed.signature);
        formData.append("file", file);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) return { url: data.secure_url as string, name: file.name };
        toast.error(data.error?.message || `Failed to upload ${file.name}.`);
        return null;
      }

      formData.append("kind", kind);
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/api/feedback/upload`, {
        method: "POST",
        headers: auth,
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) return data.attachment as Attachment;
      toast.error(data.error || `Failed to upload ${file.name}.`);
    } catch {
      toast.error(`Network error uploading ${file.name}.`);
    }
    return null;
  };

  const handlePhotos = async (files: File[]) => {
    if (photos.length + files.length > MAX_PHOTOS) {
      toast.error(`Attach at most ${MAX_PHOTOS} photos.`);
      return;
    }
    setUploading("photo");
    for (const file of files) {
      const attachment = await uploadFile(file, "photo");
      if (attachment) setPhotos((current) => [...current, attachment]);
    }
    setUploading(null);
  };

  const handleAttendance = async ([file]: File[]) => {
    if (!file) return;
    setUploading("attendance");
    const attachment = await uploadFile(file, "attendance");
    if (attachment) setAttendance(attachment);
    setUploading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0 || !attendance) {
      toast.error("Attach at least one photo and the attendance sheet.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/event/${eventSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          eventDetails,
          collaboratingChapters: collaborators,
          participants,
          rasMembers,
          photos,
          attendance,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContext({ ...context, feedback: data.feedback });
        toast.success("Feedback sent to the Main Admin for verification.");
      } else {
        toast.error(data.error || "Failed to submit feedback.");
      }
    } catch {
      toast.error("Network error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const { feedback } = context;

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
      <h2 id="feedback-heading" className="text-xl font-bold uppercase tracking-tight text-ink">
        AKRASC Feedback Form
      </h2>
      {feedback && (
        <span
          className={`border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${STATUS_BADGE[feedback.status]}`}
        >
          {feedback.status === "pending" ? "Awaiting verification" : feedback.status}
        </span>
      )}
    </div>
  );

  let body: React.ReactNode;

  if (context.eventStatus !== "verified") {
    body = (
      <p className="mt-4 text-sm text-muted">
        The feedback form opens once the Main Admin publishes this event.
      </p>
    );
  } else if (!context.cluster) {
    body = (
      <p className="mt-4 text-sm text-muted">
        Your chapter is not assigned to a cluster yet. Please contact the Main Admin.
      </p>
    );
  } else if (feedback?.status === "verified") {
    body = (
      <div className="mt-4 space-y-3">
        <p className="text-sm text-muted">
          Verified by the Main Admin. These points now count on the leaderboard.
        </p>
        <PointsSummary feedback={feedback} />
        {feedback.reviewNote && (
          <p className="border-l-2 border-brand pl-3 text-sm text-muted">Admin note: {feedback.reviewNote}</p>
        )}
      </div>
    );
  } else {
    body = (
      <form onSubmit={handleSubmit} className="mt-5 space-y-8">
        {feedback?.status === "rejected" && (
          <p className="border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            Rejected by the Main Admin: {feedback.reviewNote} Correct the form and submit it again.
          </p>
        )}
        {feedback?.status === "pending" && (
          <div className="space-y-2">
            <p className="text-sm text-muted">
              Submitted. You will earn these points once the Main Admin verifies the form, and you can still
              edit it until then.
            </p>
            <PointsSummary feedback={feedback} />
          </div>
        )}

        <div className="border border-brand/30 bg-surface-soft/50 p-4">
          <h3 className="text-sm font-bold uppercase tracking-tight text-brand">Scoreboard Distribution</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {SCOREBOARD.map((category, index) => (
              <div key={category.title}>
                <p className="text-xs font-bold text-ink">
                  {index + 1}. {category.title}
                </p>
                <ul className="mt-1 space-y-1 text-xs leading-5 text-muted">
                  {category.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <fieldset className="space-y-4">
          <legend className={headingClass}>Event Information</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <span className={labelClass}>Event Name</span>
              <p className="border-b border-line py-2.5 text-sm font-bold text-ink">{context.eventName}</p>
            </div>
            <div>
              <span className={labelClass}>Cluster No.</span>
              <p className="border-b border-line py-2.5 font-mono text-sm font-bold text-ink">{context.cluster}</p>
            </div>
          </div>
          <div>
            <label htmlFor="feedback-details" className={labelClass}>
              Event Details
            </label>
            <textarea
              id="feedback-details"
              required
              rows={3}
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="What happened at the event, who led it, and what was covered..."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <span className={labelClass}>Collaborative Colleges</span>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              <li className="flex items-start gap-2 border border-line bg-surface-soft p-3 text-sm text-muted">
                <input type="checkbox" checked disabled className="mt-1 accent-brand" aria-label={context.chapterName} />
                <span>
                  <span className="block font-bold text-ink">{context.chapterName}</span>
                  <span className="block text-xs">{context.college} (host)</span>
                </span>
              </li>
              {context.clusterChapters.map((chapter) => (
                <li key={chapter._id}>
                  <label className="flex h-full cursor-pointer items-start gap-2 border border-line p-3 text-sm transition-colors hover:bg-surface-soft">
                    <input
                      type="checkbox"
                      checked={collaborators.includes(chapter._id)}
                      onChange={(e) =>
                        setCollaborators((current) =>
                          e.target.checked
                            ? [...current, chapter._id]
                            : current.filter((id) => id !== chapter._id)
                        )
                      }
                      className="mt-1 accent-brand"
                    />
                    <span>
                      <span className="block font-bold text-ink">{chapter.name}</span>
                      <span className="block text-xs text-muted">{chapter.college}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className={headingClass}>Participation Details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="feedback-participants" className={labelClass}>
                No. of Participants
              </label>
              <input
                id="feedback-participants"
                type="number"
                required
                min={0}
                step={1}
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="feedback-ras-members" className={labelClass}>
                No. of IEEE RAS Members as Participants
              </label>
              <input
                id="feedback-ras-members"
                type="number"
                required
                min={0}
                step={1}
                value={rasMembers}
                onChange={(e) => setRasMembers(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className={headingClass}>Attachments</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FilePicker
                id="feedback-photos"
                label="Screenshots or Photos"
                hint={`PNG, JPG or WEBP, up to ${MAX_PHOTOS} files, under 5MB each`}
                accept=".png,.jpg,.jpeg,.webp"
                multiple
                busy={uploading === "photo"}
                onFiles={handlePhotos}
              />
              <ul className="space-y-1">
                {photos.map((photo) => (
                  <AttachmentChip
                    key={photo.url}
                    attachment={photo}
                    onRemove={() => setPhotos((current) => current.filter((item) => item.url !== photo.url))}
                  />
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <FilePicker
                id="feedback-attendance"
                label="Attendance Sheet"
                hint="Excel (.xlsx) or PNG, under 5MB"
                accept=".xlsx,.png"
                busy={uploading === "attendance"}
                onFiles={handleAttendance}
              />
              {attendance && (
                <ul>
                  <AttachmentChip attachment={attendance} onRemove={() => setAttendance(null)} />
                </ul>
              )}
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={submitting || uploading !== null}
          className="min-h-12 w-full bg-ink px-6 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-brand disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Sending..." : feedback ? "Update & Resubmit" : "Send to Main Admin"}
        </button>
      </form>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="feedback"
      aria-labelledby="feedback-heading"
      className="mt-12 border border-line bg-surface p-5 md:p-6"
    >
      {header}
      {body}
    </section>
  );
}
