"use client";
import { resolveMediaUrl } from "@/config/api";
import type { useDashboard } from "@/hooks/use-dashboard";
import { Calendar, ClipboardText, Image as ImageIcon, MapPin, Plus, Trash } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
export function EventsPanel({ dashboard }: { dashboard: ReturnType<typeof useDashboard> }) {
  const { toast, role, adminChapterSlug, chapters, myFeedback, eventName, setEventName, eventChapter, setEventChapter, eventDate, setEventDate, eventLocation, setEventLocation, eventDesc, setEventDesc, eventRegistrationLink, setEventRegistrationLink, eventImageFile, imagePreviewUrl, setEventImageFile, editingEventImageUrl, uploadingEvent, eventFeatured, setEventFeatured, editingEventSlug, rejectingEventSlug, setRejectingEventSlug, rejectionReasonText, setRejectionReasonText, handleAddEvent, handleDeleteEvent, handleVerifyEvent, handleStartEditEvent, handleCancelEdit, displayedEvents } = dashboard;
  return (<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
    {/* Events list */}
    <div className="xl:col-span-7 space-y-6">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
          Events Directory
        </h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
          {displayedEvents.length === 0 ? (
            <p className="text-xs font-mono text-muted">No events logged yet.</p>
          ) : (
            displayedEvents.map((event) => (
              <div
                key={event.slug}
                className="border border-line p-4 bg-surface flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {event.image && (
                      <div className="size-20 bg-surface-soft border border-line shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={resolveMediaUrl(event.image)}
                          alt={event.name}
                          className="w-full h-full object-cover"
                          width={640} height={640} loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brand font-bold bg-surface-soft px-2 py-0.5 border border-line">
                        {chapters.find((c) => c.slug === event.chapterSlug)?.name || event.chapterSlug}
                      </span>
                      <h3 className="text-base font-bold text-ink uppercase mt-2">{event.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-3 text-muted text-[11px] font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {event.location}
                        </span>
                        {event.registrationLink && (
                          <span className="flex items-center gap-1">
                            <svg className="size-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <a href={event.registrationLink.startsWith("http") ? event.registrationLink : `https://${event.registrationLink}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-brand uppercase">
                              Registration Link
                            </a>
                          </span>
                        )}
                      </div>

                      {event.description && event.description.length > 0 && event.description[0] && (
                        <p className="text-xs text-muted mt-2 max-w-xl font-sans leading-relaxed">
                          {event.description[0]}
                        </p>
                      )}

                      {/* Status badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {event.status === "verified" && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 font-bold">
                            Verified & Published
                          </span>
                        )}
                        {event.status === "pending" && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-300 font-bold">
                            Pending Verification
                          </span>
                        )}
                        {event.status === "rejected" && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-300 font-bold">
                            Rejected
                          </span>
                        )}
                      </div>

                      {event.status === "rejected" && event.rejectionReason && (
                        <div className="mt-2 text-[10px] font-mono text-rose-600 bg-rose-50/50 p-2 border border-rose-100 uppercase tracking-tight">
                          {"// Reason: {event.rejectionReason}"}
                        </div>
                      )}

                      {role === "subadmin" && event.status === "verified" && (() => {
                        const feedback = myFeedback.find((item) => item.event?.slug === event.slug);
                        const label = !feedback
                          ? "Fill Feedback Form"
                          : feedback.status === "verified"
                            ? `${feedback.points.total} Points Awarded`
                            : feedback.status === "rejected"
                              ? "Feedback Rejected: Resubmit"
                              : "Feedback Awaiting Verification";
                        return (
                          <Link
                            href={`/events/${event.slug}#feedback`}
                            className="mt-3 inline-flex items-center gap-1.5 border border-brand px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-brand transition-colors hover:bg-brand hover:text-white"
                          >
                            <ClipboardText size={12} />
                            {label}
                          </Link>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right actions: Delete & Edit */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleDeleteEvent(event.slug)}
                      aria-label={`Delete event ${event.name}`}
                      className="size-8 border border-line text-muted hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-colors duration-155"
                    >
                      <Trash size={15} />
                    </button>
                    <button
                      onClick={() => handleStartEditEvent(event)}
                      aria-label={`Edit event ${event.name}`}
                      className="size-8 border border-line text-muted hover:text-ink hover:border-ink flex items-center justify-center transition-colors duration-155"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Superadmin Verification flow actions */}
                {role === "superadmin" && (
                  <div className="border-t border-line pt-3 mt-1 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {event.status !== "verified" && (
                        <button
                          onClick={() => handleVerifyEvent(event.slug, "verified")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                        >
                          Verify & Publish
                        </button>
                      )}
                      {event.status !== "rejected" && rejectingEventSlug !== event.slug && (
                        <button
                          onClick={() => {
                            setRejectingEventSlug(event.slug);
                            setRejectionReasonText("");
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </div>

                    {rejectingEventSlug === event.slug && (
                      <div className="bg-surface-soft p-3 border border-line mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                          Rejection Reason (Optional):
                        </p>
                        <input
                          type="text" aria-label="Reason for rejecting event"
                          value={rejectionReasonText}
                          onChange={(e) => setRejectionReasonText(e.target.value)}
                          placeholder="e.g. Poster needs revision / wrong category"
                          className="w-full bg-transparent py-1.5 border-b border-line text-xs text-ink outline-none focus:border-brand mb-3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifyEvent(event.slug, "rejected", rejectionReasonText)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                          >
                            Confirm Rejection
                          </button>
                          <button
                            onClick={() => {
                              setRejectingEventSlug(null);
                              setRejectionReasonText("");
                            }}
                            className="px-3 py-1 border border-line text-muted font-mono text-[9px] uppercase tracking-wider hover:bg-surface-soft transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* Event Upload Form */}
    <div className="xl:col-span-5">
      <div id="event-form-section" className="border border-line p-6 bg-surface">
        <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
          {editingEventSlug ? `Edit Event: ${editingEventSlug}` : "Add New Event"}
        </h2>

        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-1">
              Event Title
            </label>
            <input id="dashboard-field-1"
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. The Robo Crewtales"
              className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="event-chapter">Host Chapter</label>
            {role === "subadmin" ? (
              <div className="py-2.5 border-b border-line text-sm text-brand uppercase font-bold font-mono">
                {chapters.find((c) => c.slug === adminChapterSlug)?.name || adminChapterSlug}
              </div>
            ) : chapters.length === 0 ? (
              <p className="text-xs text-red-500 font-mono mt-1">Please create a chapter first.</p>
            ) : (
              <select id="event-chapter"
                value={eventChapter}
                onChange={(e) => setEventChapter(e.target.value)}
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              >
                {chapters.map((ch) => (
                  <option key={ch.slug} value={ch.slug}>
                    {ch.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-2">
                Date
              </label>
              <input id="dashboard-field-2"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="e.g. September 2, 2026"
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-3">
                Location
              </label>
              <input id="dashboard-field-3"
                type="text"
                required
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g. CUSAT Campus, Kochi"
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
              Brief Description
            </label>
            <textarea id="dashboard-field-4"
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              placeholder="Details about the event..."
              rows={2}
              className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors resize-none rounded-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-5">
              Registration Link (Optional)
            </label>
            <input id="dashboard-field-5"
              type="url"
              value={eventRegistrationLink}
              onChange={(e) => setEventRegistrationLink(e.target.value)}
              placeholder="https://example.com/register"
              className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2" htmlFor="event-image">
              Event Image (Upload to Cloudinary {editingEventSlug && "• Optional"})
            </label>
            <div className="border border-dashed border-line p-4 text-center cursor-pointer hover:bg-surface-soft transition-colors relative flex flex-col items-center gap-2">
              <ImageIcon size={24} className="text-muted" />
              <span className="text-xs text-muted font-mono">
                {eventImageFile ? eventImageFile.name : "Select JPG / PNG poster (Upload under 4MB)"}
              </span>
              <input
                id="event-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    if (file.size > 4 * 1024 * 1024) {
                      toast.error("Upload under 4MB");
                      e.target.value = "";
                      setEventImageFile(null);
                    } else {
                      setEventImageFile(file);
                    }
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            {imagePreviewUrl && (
              <div className="mt-3 relative border border-line p-2 bg-surface-soft flex flex-col items-center">
                <span className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wider">{"// Selected File Preview"}</span>
                <Image
                  src={imagePreviewUrl}
                  alt="Selected Preview"
                  className="max-h-48 object-contain border border-line"
                  width={640} height={640} loading="lazy" decoding="async" />
              </div>
            )}
            {!imagePreviewUrl && editingEventImageUrl && (
              <div className="mt-3 relative border border-line p-2 bg-surface-soft flex flex-col items-center">
                <span className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wider">{"// Current Event Image"}</span>
                <Image
                  src={resolveMediaUrl(editingEventImageUrl)}
                  alt="Current Event Image"
                  className="max-h-48 object-contain border border-line"
                  width={640} height={640} loading="lazy" decoding="async" />
              </div>
            )}
          </div>

          {role === "superadmin" && <label className="flex items-center gap-2"><input type="checkbox" checked={eventFeatured} onChange={e => setEventFeatured(e.target.checked)} />Featured event</label>}
          <div className="flex gap-4 mt-4">
            {editingEventSlug && (

              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-1/2 min-h-12 border border-ink text-ink font-mono text-xs uppercase tracking-wider transition-colors hover:bg-surface-soft rounded-none flex items-center justify-center"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={uploadingEvent || (role !== "subadmin" && chapters.length === 0)}
              className={`${editingEventSlug ? "w-1/2" : "w-full"} min-h-12 bg-ink text-white font-mono text-xs uppercase tracking-wider transition-colors hover:bg-brand disabled:opacity-50 rounded-none flex items-center justify-center gap-2`}
            >
              {uploadingEvent ? (
                <span className="animate-pulse">Saving to Cloudinary...</span>
              ) : (
                <>
                  <Plus size={14} />
                  {role === "subadmin" ? "Submit Request to Admin" : editingEventSlug ? "Save Changes" : "Publish Event"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>);
}
