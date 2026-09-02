"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOut, Plus, Trash, Calendar, MapPin, ShieldCheck, Image as ImageIcon, Key, List, Users } from "@phosphor-icons/react";
import { useToast } from "@/components/toast";
import { API_BASE_URL } from "@/config/api";

type DbChapter = {
  slug: string;
  name: string;
  college: string;
  location: string;
  description: string;
  logo: string;
  featured: boolean;
};

type DbEvent = {
  slug: string;
  chapterSlug: string;
  name: string;
  image: string;
  imageAlt: string;
  location: string;
  date: string;
  description: string[];
  featured: boolean;
  archived: boolean;
  status?: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  registrationLink?: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState("");
  const [role, setRole] = useState<"superadmin" | "subadmin">("subadmin");
  const [adminChapterSlug, setAdminChapterSlug] = useState("");
  const [chapters, setChapters] = useState<DbChapter[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);

  // Sub-Admins Management State
  const [subadmins, setSubadmins] = useState<any[]>([]);
  const [subUsername, setSubUsername] = useState("");
  const [subPassword, setSubPassword] = useState("");
  const [editingSubPasswordUsername, setEditingSubPasswordUsername] = useState<string | null>(null);
  const [newSubPassword, setNewSubPassword] = useState("");

  // Feedback Messages
  const [chapterSuccess, setChapterSuccess] = useState(false);
  const [eventSuccess, setEventSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Chapter Form State
  const [chapterName, setChapterName] = useState("");
  const [chapterCollege, setChapterCollege] = useState("");
  const [chapterLocation, setChapterLocation] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [editingChapterSlug, setEditingChapterSlug] = useState<string | null>(null);

  // Event Form State
  const [eventName, setEventName] = useState("");
  const [eventChapter, setEventChapter] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventRegistrationLink, setEventRegistrationLink] = useState("");
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [editingEventImageUrl, setEditingEventImageUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [uploadingEvent, setUploadingEvent] = useState(false);

  useEffect(() => {
    if (!eventImageFile) {
      setImagePreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(eventImageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [eventImageFile]);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"events" | "chapters" | "subadmins">("events");

  // Event Editing and Rejection State
  const [editingEventSlug, setEditingEventSlug] = useState<string | null>(null);
  const [rejectingEventSlug, setRejectingEventSlug] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState("");



  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const triggerConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const fetchSubadmins = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/subadmins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubadmins(data);
      }
    } catch (err) {
      console.error("Error fetching subadmins:", err);
    }
  };

  const fetchData = async (currentRole?: string, chapterSlug?: string) => {
    try {
      const chaptersRes = await fetch(`${API_BASE_URL}/api/chapters`);
      const chaptersData = await chaptersRes.json();
      setChapters(chaptersData);
      
      const activeRole = currentRole || role;
      const activeSlug = chapterSlug || adminChapterSlug;

      if (chaptersData.length > 0) {
        if (activeRole === "superadmin") {
          setEventChapter(chaptersData[0].slug);
        } else {
          setEventChapter(activeSlug);
        }
      }

      const token = localStorage.getItem("admin_token");
      const eventsRes = await fetch(`${API_BASE_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      if (activeRole === "superadmin") {
        await fetchSubadmins();
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setAdminUser(data.decoded.username);
          setRole(data.decoded.role);
          setAdminChapterSlug(data.decoded.chapterSlug || "");
          await fetchData(data.decoded.role, data.decoded.chapterSlug);
          setLoading(false);
        } else {
          localStorage.removeItem("admin_token");
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        localStorage.removeItem("admin_token");
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  const handleDeleteSubadmin = async (username: string) => {
    triggerConfirm(`Are you sure you want to delete sub-admin @${username}?`, async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/subadmins/${username}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success(`Sub-admin @${username} deleted successfully.`);
          await fetchSubadmins();
        } else {
          toast.error("Failed to delete sub-admin.");
        }
      } catch (err) {
        console.error("Failed to delete sub-admin:", err);
        toast.error("Network error deleting sub-admin.");
      }
    });
  };

  const handleUpdateSubPassword = async (username: string) => {
    if (!newSubPassword) {
      toast.error("Password cannot be empty.");
      return;
    }
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/subadmins/${username}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newSubPassword }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEditingSubPasswordUsername(null);
        setNewSubPassword("");
        toast.success(`Password for @${username} updated successfully.`);
      } else {
        toast.error(data.error || "Failed to update sub-admin password.");
      }
    } catch (err) {
      toast.error("Network error occurred.");
    }
  };



  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingChapterSlug) {
      if (!chapterName || !chapterCollege || !chapterLocation) {
        toast.error("Please fill all chapter fields.");
        return;
      }
    } else {
      if (!chapterName || !chapterCollege || !chapterLocation || !subUsername || !subPassword) {
        toast.error("Please fill all chapter and sub-admin fields.");
        return;
      }
    }

    const token = localStorage.getItem("admin_token");
    try {
      const url = editingChapterSlug
        ? `${API_BASE_URL}/api/chapters/${editingChapterSlug}`
        : `${API_BASE_URL}/api/chapters`;
      const method = editingChapterSlug ? "PUT" : "POST";

      const bodyData = editingChapterSlug
        ? {
            name: chapterName,
            college: chapterCollege,
            location: chapterLocation,
            description: chapterDesc,
          }
        : {
            name: chapterName,
            college: chapterCollege,
            location: chapterLocation,
            description: chapterDesc,
            username: subUsername,
            password: subPassword,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setChapterName("");
        setChapterCollege("");
        setChapterLocation("");
        setChapterDesc("");
        setSubUsername("");
        setSubPassword("");
        setEditingChapterSlug(null);
        toast.success(editingChapterSlug ? "Chapter updated successfully." : "Chapter & Sub-Admin created successfully.");
        await fetchData();
      } else {
        toast.error(data.error || "Failed to save chapter.");
      }
    } catch (err) {
      toast.error("Network error occurred.");
    }
  };

  const handleStartEditChapter = (chapter: DbChapter) => {
    setEditingChapterSlug(chapter.slug);
    setChapterName(chapter.name);
    setChapterCollege(chapter.college);
    setChapterLocation(chapter.location);
    setChapterDesc(chapter.description || "");
    const formEl = document.getElementById("chapter-form-section");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditChapter = () => {
    setEditingChapterSlug(null);
    setChapterName("");
    setChapterCollege("");
    setChapterLocation("");
    setChapterDesc("");
    setSubUsername("");
    setSubPassword("");
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeChapterSlug = role === "subadmin" ? adminChapterSlug : eventChapter;
    if (!eventName || !activeChapterSlug || !eventDate || !eventLocation) return;
    setErrorMessage("");
    setUploadingEvent(true);

    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("name", eventName);
    formData.append("chapterSlug", activeChapterSlug);
    formData.append("date", eventDate);
    formData.append("location", eventLocation);
    formData.append("description", eventDesc);
    formData.append("featured", "true"); // Always featured by default on dashboard upload
    if (eventRegistrationLink) {
      formData.append("registrationLink", eventRegistrationLink);
    }
    if (eventImageFile) {
      formData.append("image", eventImageFile);
    }

    const url = editingEventSlug
      ? `${API_BASE_URL}/api/events/${editingEventSlug}`
      : `${API_BASE_URL}/api/events`;
    const method = editingEventSlug ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEventName("");
        setEventDate("");
        setEventLocation("");
        setEventDesc("");
        setEventRegistrationLink("");
        setEventImageFile(null);
        setEditingEventImageUrl("");
        // Clear file input manually
        const fileInput = document.getElementById("event-image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setEditingEventSlug(null);

        toast.success(
          role === "subadmin"
            ? "Event request submitted to Main Admin for approval."
            : editingEventSlug
            ? "Event updated successfully."
            : "Event created and published successfully."
        );
        await fetchData();
      } else {
        toast.error(data.error || "Failed to save event.");
      }
    } catch (err) {
      toast.error("Network error occurred during upload.");
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (slug: string) => {
    triggerConfirm("Are you sure you want to delete this event?", async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${slug}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("Event deleted successfully.");
          await fetchData();
        } else {
          toast.error("Failed to delete event.");
        }
      } catch (err) {
        console.error("Failed to delete event:", err);
        toast.error("Network error deleting event.");
      }
    });
  };

  const handleVerifyEvent = async (slug: string, status: "verified" | "rejected", reason: string = "") => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          rejectionReason: reason,
        }),
      });

      if (response.ok) {
        setRejectingEventSlug(null);
        setRejectionReasonText("");
        toast.success(status === "verified" ? "Event verified and published." : "Event rejected.");
        await fetchData();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update event status.");
      }
    } catch (err) {
      toast.error("Network error verifying event.");
    }
  };

  const handleStartEditEvent = (event: DbEvent) => {
    setEditingEventSlug(event.slug);
    setEventName(event.name);
    setEventDate(event.date);
    setEventLocation(event.location);
    setEventDesc(event.description ? event.description[0] : "");
    setEventRegistrationLink(event.registrationLink || "");
    setEditingEventImageUrl(event.image || "");
    if (role === "superadmin") {
      setEventChapter(event.chapterSlug);
    }
    const formEl = document.getElementById("event-form-section");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingEventSlug(null);
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventDesc("");
    setEventRegistrationLink("");
    setEventImageFile(null);
    setEditingEventImageUrl("");
    const fileInput = document.getElementById("event-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleDeleteChapter = async (slug: string) => {
    triggerConfirm("Deleting this chapter will also delete all its associated events. Proceed?", async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/chapters/${slug}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("Chapter and associated events deleted.");
          await fetchData();
        } else {
          toast.error("Failed to delete chapter.");
        }
      } catch (err) {
        console.error("Failed to delete chapter:", err);
        toast.error("Network error deleting chapter.");
      }
    });
  };

  const displayedChapters = role === "superadmin"
    ? chapters
    : chapters.filter(c => c.slug === adminChapterSlug);

  const displayedEvents = role === "superadmin"
    ? events
    : events.filter(e => e.chapterSlug === adminChapterSlug);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted animate-pulse">
          Verifying Session Credentials...
        </span>
      </div>
    );
  }

  return (
    <div className="page-container py-12 md:py-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-line pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 bg-brand rounded-none" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
              Admin Session // Active
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-ink mt-2">
            Control Console
          </h1>
          <p className="text-xs font-mono text-muted mt-1">
            Logged in as <span className="text-brand font-bold">@{adminUser}</span>
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-transparent hover:bg-ink hover:text-white px-5 text-xs font-mono uppercase tracking-wider text-ink transition-colors duration-150 rounded-none cursor-pointer self-start md:self-auto"
        >
          <SignOut size={14} />
          Sign Out
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-l-2 border-red-500 p-4 mt-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-bold">Error</p>
          <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="border border-line bg-surface p-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
            // Registered Chapters
          </span>
          <p className="text-3xl font-extrabold text-brand mt-2 font-mono">
            {displayedChapters.length.toString().padStart(2, "0")}
          </p>
        </div>
        <div className="border border-line bg-surface p-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
            // Total Active Events
          </span>
          <p className="text-3xl font-extrabold text-brand mt-2 font-mono">
            {displayedEvents.length.toString().padStart(2, "0")}
          </p>
        </div>
        <div className="border border-line bg-surface p-6 flex flex-col justify-between">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
            // Security Status
          </span>
          <div className="flex items-center gap-2 mt-2 text-emerald-600">
            <ShieldCheck size={24} weight="bold" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {role === "superadmin" ? "SUPER ADMIN ACCESS" : "SUB ADMIN ACCESS"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Panel layout with Sidebar Tabs for improved Desktop responsiveness and focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border border-line p-2 bg-surface select-none no-scrollbar">
          {/* Events Tab */}
          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${
              activeTab === "events"
                ? "bg-ink text-white border-ink font-bold"
                : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
            }`}
          >
            <Calendar size={16} />
            Events Directory
          </button>

          {/* Chapters Tab */}
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${
              activeTab === "chapters"
                ? "bg-ink text-white border-ink font-bold"
                : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
            }`}
          >
            <List size={16} />
            SB Chapters
          </button>

          {/* Sub-Admins Tab (Superadmin only) */}
          {role === "superadmin" && (
            <button
              onClick={() => setActiveTab("subadmins")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${
                activeTab === "subadmins"
                  ? "bg-ink text-white border-ink font-bold"
                  : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
              }`}
            >
              <Users size={16} />
              Sub-Admins
            </button>
          )}
        </div>

        {/* Right Column: Dynamic Panel Content */}
        <div className="lg:col-span-9 space-y-6">
          
          {activeTab === "events" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
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
                                  <img
                                    src={event.image ? (event.image.startsWith("/uploads/") ? `${API_BASE_URL}${event.image}` : event.image) : "/card1.jpeg"}
                                    alt={event.name}
                                    className="w-full h-full object-cover"
                                  />
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
                                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-brand uppercase">
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
                                    // Reason: {event.rejectionReason}
                                  </div>
                                )}
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
                                    type="text"
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
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        required
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="e.g. The Robo Crewtales"
                        className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                        Host Chapter
                      </label>
                      {role === "subadmin" ? (
                        <div className="py-2.5 border-b border-line text-sm text-brand uppercase font-bold font-mono">
                          {chapters.find((c) => c.slug === adminChapterSlug)?.name || adminChapterSlug}
                        </div>
                      ) : chapters.length === 0 ? (
                        <p className="text-xs text-red-500 font-mono mt-1">Please create a chapter first.</p>
                      ) : (
                        <select
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
                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          placeholder="e.g. September 2, 2026"
                          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                          Location
                        </label>
                        <input
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
                      <textarea
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        placeholder="Details about the event..."
                        rows={2}
                        className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors resize-none rounded-none"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                        Registration Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={eventRegistrationLink}
                        onChange={(e) => setEventRegistrationLink(e.target.value)}
                        placeholder="https://example.com/register"
                        className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2">
                        Event Image (Upload to Cloudinary {editingEventSlug && "• Optional"})
                      </label>
                      <div className="border border-dashed border-line p-4 text-center cursor-pointer hover:bg-surface-soft transition-colors relative flex flex-col items-center gap-2">
                        <ImageIcon size={24} className="text-muted" />
                        <span className="text-xs text-muted font-mono">
                          {eventImageFile ? eventImageFile.name : "Select JPG / PNG poster (Upload under 5MB)"}
                        </span>
                        <input
                          id="event-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("Upload under 5MB");
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
                          <span className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wider">// Selected File Preview</span>
                          <img
                            src={imagePreviewUrl}
                            alt="Selected Preview"
                            className="max-h-48 object-contain border border-line"
                          />
                        </div>
                      )}
                      {!imagePreviewUrl && editingEventImageUrl && (
                        <div className="mt-3 relative border border-line p-2 bg-surface-soft flex flex-col items-center">
                          <span className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wider">// Current Event Image</span>
                          <img
                            src={editingEventImageUrl.startsWith("/uploads/") ? `${API_BASE_URL}${editingEventImageUrl}` : editingEventImageUrl}
                            alt="Current Event Image"
                            className="max-h-48 object-contain border border-line"
                          />
                        </div>
                      )}
                    </div>

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
            </div>
          )}

          {activeTab === "chapters" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Chapters list */}
              <div className="xl:col-span-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
                    Student Branch Chapters
                  </h2>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                    {displayedChapters.length === 0 ? (
                      <p className="text-xs font-mono text-muted">No chapters logged yet.</p>
                    ) : (
                      displayedChapters.map((chapter) => (
                        <div
                          key={chapter.slug}
                          className="border border-line p-4 bg-surface flex items-center justify-between gap-4"
                        >
                          <div>
                            <h3 className="text-sm font-bold text-ink uppercase">{chapter.name}</h3>
                            <p className="text-[11px] text-muted font-mono mt-1">
                              {chapter.college} • {chapter.location}
                            </p>
                          </div>
                          {role === "superadmin" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStartEditChapter(chapter)}
                                aria-label={`Edit chapter ${chapter.name}`}
                                className="size-8 border border-line text-muted hover:text-ink hover:border-ink flex items-center justify-center transition-colors duration-155"
                              >
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteChapter(chapter.slug)}
                                aria-label={`Delete chapter ${chapter.name}`}
                                className="size-8 border border-line text-muted hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-colors duration-155"
                              >
                                <Trash size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Chapter Upload/Edit Form */}
              <div className="xl:col-span-5">
                {role === "superadmin" ? (
                  <div id="chapter-form-section" className="border border-line p-6 bg-surface">
                    <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
                      {editingChapterSlug ? `Edit Chapter: ${editingChapterSlug}` : "Add New Chapter & Sub-Admin"}
                    </h2>

                    <form onSubmit={handleAddChapter} className="space-y-4">
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                          Chapter Name
                        </label>
                        <input
                          type="text"
                          required
                          value={chapterName}
                          onChange={(e) => setChapterName(e.target.value)}
                          placeholder="e.g. Robotics Society MEC"
                          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                          College
                        </label>
                        <input
                          type="text"
                          required
                          value={chapterCollege}
                          onChange={(e) => setChapterCollege(e.target.value)}
                          placeholder="e.g. Govt Model Engineering College"
                          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          required
                          value={chapterLocation}
                          onChange={(e) => setChapterLocation(e.target.value)}
                          placeholder="e.g. Kochi, Kerala"
                          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                          Description
                        </label>
                        <textarea
                          value={chapterDesc}
                          onChange={(e) => setChapterDesc(e.target.value)}
                          placeholder="A student community exploring..."
                          rows={2}
                          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors resize-none rounded-none"
                        />
                      </div>

                      {!editingChapterSlug && (
                        <>
                          <div className="border-t border-line pt-4 mt-6">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand block mb-3">
                              // Associated Sub-Admin Account
                            </span>
                          </div>

                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                              Sub-Admin Username
                            </label>
                            <input
                              type="text"
                              required
                              value={subUsername}
                              onChange={(e) => setSubUsername(e.target.value)}
                              placeholder="e.g. mec_admin"
                              className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                            />
                          </div>

                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                              Sub-Admin Password
                            </label>
                            <input
                              type="password"
                              required
                              value={subPassword}
                              onChange={(e) => setSubPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex gap-4 mt-4">
                        {editingChapterSlug && (
                          <button
                            type="button"
                            onClick={handleCancelEditChapter}
                            className="w-1/2 min-h-12 border border-ink text-ink font-mono text-xs uppercase tracking-wider transition-colors hover:bg-surface-soft rounded-none flex items-center justify-center"
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className={`${editingChapterSlug ? "w-1/2" : "w-full"} min-h-12 bg-ink text-white font-mono text-xs uppercase tracking-wider transition-colors hover:bg-brand rounded-none flex items-center justify-center gap-2`}
                        >
                          {editingChapterSlug ? (
                            <>
                              <Plus size={14} />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              Create Chapter & Sub-Admin
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="border border-line p-6 bg-surface">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted block mb-3">
                      // Access Information
                    </span>
                    <h3 className="text-sm font-bold uppercase text-ink">View Only Mode</h3>
                    <p className="text-xs text-muted font-mono mt-2 leading-relaxed">
                      Sub-admin accounts do not have permission to register or edit Student Branch Chapters.
                      Please contact a Super Admin if you need updates.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "subadmins" && role === "superadmin" && (
            <div className="border border-line p-6 bg-surface max-w-4xl">
              <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
                Registered Sub-Admins
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {subadmins.length === 0 ? (
                  <p className="text-[11px] font-mono text-muted col-span-2">No sub-admin accounts created.</p>
                ) : (
                  subadmins.map((sub) => (
                    <div key={sub.username} className="flex flex-col justify-between gap-3 text-xs bg-surface-soft p-4 border border-line">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-ink uppercase font-mono">@{sub.username}</p>
                          <p className="text-[10px] font-mono text-muted mt-0.5 uppercase tracking-tight">
                            {chapters.find((c) => c.slug === sub.chapterSlug)?.name || sub.chapterSlug}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingSubPasswordUsername(
                                editingSubPasswordUsername === sub.username ? null : sub.username
                              );
                              setNewSubPassword("");
                            }}
                            aria-label={`Change password for @${sub.username}`}
                            className="size-7 border border-line text-muted hover:text-ink hover:border-ink flex items-center justify-center transition-colors duration-155"
                          >
                            <Key size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteSubadmin(sub.username)}
                            className="size-7 border border-line text-muted hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-colors duration-150"
                          >
                            <Trash size={13} />
                          </button>
                        </div>
                      </div>

                      {editingSubPasswordUsername === sub.username && (
                        <div className="border-t border-line pt-3 mt-1 flex items-center gap-2">
                          <input
                            type="password"
                            placeholder="New Password"
                            value={newSubPassword}
                            onChange={(e) => setNewSubPassword(e.target.value)}
                            className="flex-1 bg-transparent py-1 border-b border-line text-[11px] text-ink outline-none focus:border-brand"
                          />
                          <button
                            onClick={() => handleUpdateSubPassword(sub.username)}
                            className="px-2.5 py-1 bg-ink hover:bg-brand text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSubPasswordUsername(null)}
                            className="px-2.5 py-1 border border-line text-muted font-mono text-[9px] uppercase tracking-wider hover:bg-surface-soft transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-ink/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="bg-surface border border-line p-6 max-w-sm w-full shadow-lift rounded-none"
            >
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-brand mb-1">
                // System Request
              </p>
              <h3 className="text-sm font-bold uppercase tracking-tight text-ink font-mono mb-6 leading-relaxed">
                {confirmModal.message}
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 border border-line text-muted hover:text-ink font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-4 py-2 bg-ink hover:bg-rose-600 text-white font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
