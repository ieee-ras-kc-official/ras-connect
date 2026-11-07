"use client";
import { useToast } from "@/components/toast";
import { API_BASE_URL, apiList, errorMessage as describeError, readJson } from "@/config/api";
import { useApi } from "@/hooks/use-api";
import { useFilePreview } from "@/hooks/use-file-preview";
import type { Cluster, Chapter as DbChapter, RasEvent as DbEvent, SubAdmin } from "@/types/api";
import type { Feedback } from "@/utils/feedback";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useDashboard() {

  const router = useRouter();
  const toast = useToast();
  const fetch = useApi();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState("");
  const [role, setRole] = useState<"superadmin" | "subadmin">("subadmin");
  const [adminChapterSlug, setAdminChapterSlug] = useState("");
  const [chapters, setChapters] = useState<DbChapter[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [myFeedback, setMyFeedback] = useState<Feedback[]>([]);

  // Sub-Admins Management State
  const [subadmins, setSubadmins] = useState<SubAdmin[]>([]);
  const [subUsername, setSubUsername] = useState("");
  const [subPassword, setSubPassword] = useState("");
  const [editingSubPasswordUsername, setEditingSubPasswordUsername] = useState<string | null>(null);
  const [newSubPassword, setNewSubPassword] = useState("");

  // Feedback Messages
  const [errorMessage, setErrorMessage] = useState("");

  // Chapter Form State
  const [chapterName, setChapterName] = useState("");
  const [chapterCollege, setChapterCollege] = useState("");
  const [chapterLocation, setChapterLocation] = useState("");
  const [chapterDesc, setChapterDesc] = useState("");
  const [chapterCluster, setChapterCluster] = useState("");
  const [editingChapterSlug, setEditingChapterSlug] = useState<string | null>(null);

  // Event Form State
  const [eventName, setEventName] = useState("");
  const [eventChapter, setEventChapter] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventRegistrationLink, setEventRegistrationLink] = useState("");
  const [eventImageFile, imagePreviewUrl, setEventImageFile] = useFilePreview();
  const [editingEventImageUrl, setEditingEventImageUrl] = useState("");
  const [uploadingEvent, setUploadingEvent] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"events" | "chapters" | "clusters" | "feedback" | "subadmins" | "account">("events");

  // Sub-Admin Chapter Logo & Details State
  const [subChapterDesc, setSubChapterDesc] = useState("");
  const [subChapterLogoFile, subChapterLogoPreview, setSubChapterLogoFile] = useFilePreview();
  const [uploadingChapterLogo, setUploadingChapterLogo] = useState(false);

  // Self-Service Password Reset State
  const [currentPassword, setCurrentPassword] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [savingChapter, setSavingChapter] = useState(false);
  const [eventFeatured, setEventFeatured] = useState(false);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selfNewPassword, setSelfNewPassword] = useState("");
  const [selfConfirmPassword, setSelfConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Event Editing and Rejection State
  const [editingEventSlug, setEditingEventSlug] = useState<string | null>(null);
  const [rejectingEventSlug, setRejectingEventSlug] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState("");

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => { },
  });

  const triggerConfirm = (message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: async () => {
        await onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const fetchSubadmins = useCallback(async () => {
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
  }, [fetch]);

  const fetchData = useCallback(async (currentRole?: string, chapterSlug?: string) => {
    try {
      const chaptersRes = await fetch(`${API_BASE_URL}/api/chapters`);
      const chaptersData = await readJson<DbChapter[]>(chaptersRes);
      if (!Array.isArray(chaptersData)) throw new Error("Invalid chapters response");
      setChapters(chaptersData);

      const activeRole = currentRole || role;
      const activeSlug = chapterSlug || adminChapterSlug;

      if (chaptersData.length > 0) {
        if (activeRole === "superadmin") {
          setEventChapter(selected => chaptersData.some(chapter => chapter.slug === selected) ? selected : chaptersData[0].slug);
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
      const eventsData = await readJson<DbEvent[]>(eventsRes);
      if (!Array.isArray(eventsData)) throw new Error("Invalid events response");
      setEvents(eventsData);

      if (activeRole === "superadmin") {
        await fetchSubadmins();
        setClusters(await apiList<Cluster>("/api/clusters", { headers: { Authorization: `Bearer ${token}` } }));
      } else if (activeSlug) {
        const myChapter = chaptersData.find((c: DbChapter) => c.slug === activeSlug);
        if (myChapter && myChapter.description) {
          setSubChapterDesc(myChapter.description);
        }
        const feedbackRes = await fetch(`${API_BASE_URL}/api/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (feedbackRes.ok) {
          setMyFeedback(await feedbackRes.json());
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load dashboard data.");
    }
  }, [role, adminChapterSlug, fetch, fetchSubadmins]);

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
          setMustChangePassword(Boolean(data.decoded.mustChangePassword));
          if (data.decoded.mustChangePassword) setActiveTab("account");
          else {
            const chapterRows = await apiList<DbChapter>("/api/chapters");
            setChapters(chapterRows);
            const eventRows = await apiList<DbEvent>("/api/events", { headers: { Authorization: `Bearer ${token}` } });
            setEvents(eventRows);
            setEventChapter(data.decoded.chapterSlug || chapterRows[0]?.slug || "");
            if (data.decoded.role === "superadmin") {
              setSubadmins(await apiList<SubAdmin>("/api/admin/subadmins", { headers: { Authorization: `Bearer ${token}` } }));
              setClusters(await apiList<Cluster>("/api/clusters", { headers: { Authorization: `Bearer ${token}` } }));
            } else { setSubChapterDesc(chapterRows.find(c => c.slug === data.decoded.chapterSlug)?.description || ""); setMyFeedback(await apiList<Feedback>("/api/feedback", { headers: { Authorization: `Bearer ${token}` } })); }
          }
          setLoading(false);
        } else {
          localStorage.removeItem("admin_token");
          window.dispatchEvent(new Event("auth-change"));
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        localStorage.removeItem("admin_token");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/login");
      }
    };

    verifyToken();
  }, [router, fetch]);

  const handleSignOut = () => {
    localStorage.removeItem("admin_token");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  const handleDeleteSubadmin = async (username: string) => {
    triggerConfirm(`Are you sure you want to delete sub-admin @${username}?`, async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/subadmins/${encodeURIComponent(username)}`, {
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
        toast.error(describeError(err));
      }
    });
  };

  const handleUpdateSubPassword = async (username: string) => {
    if (newSubPassword.length < 10) {
      toast.error("Password must be at least 10 characters.");
      return;
    }
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/subadmins/${encodeURIComponent(username)}/password`, {
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
        toast.error(data.message || data.error || "Failed to update sub-admin password.");
      }
    } catch (err) { toast.error(err instanceof Error ? err.message : "Request failed. Please retry."); }
  };

  const handleSubAdminUpdateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChapterSlug) {
      toast.error("No assigned chapter found for this account.");
      return;
    }

    setUploadingChapterLogo(true);
    const token = localStorage.getItem("admin_token");

    try {
      const formData = new FormData();
      if (subChapterLogoFile) {
        formData.append("image", subChapterLogoFile);
      }
      formData.append("description", subChapterDesc);

      const response = await fetch(`${API_BASE_URL}/api/chapters/${encodeURIComponent(adminChapterSlug)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Chapter logo & details updated successfully!");
        setSubChapterLogoFile(null);
        const fileInput = document.getElementById("sub-chapter-logo") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        await fetchData();
      } else {
        toast.error(data.message || data.error || "Failed to update chapter.");
      }
    } catch (err) {
      console.error("Error updating chapter logo:", err);
      toast.error(describeError(err));
    } finally {
      setUploadingChapterLogo(false);
    }
  };

  const handleSelfPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Enter the password you used to sign in.");
      return;
    }

    if (!selfNewPassword || selfNewPassword.length < 10) {
      toast.error("New password must be at least 10 characters long.");
      return;
    }

    if (selfNewPassword !== selfConfirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword: selfNewPassword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Your password has been updated successfully! Sign in again with your new password.");
        setCurrentPassword("");
        setSelfNewPassword("");
        setSelfConfirmPassword("");
        handleSignOut();
      } else {
        toast.error(data.message || data.error || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error(describeError(err));
    } finally {
      setChangingPassword(false);
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

    if (savingChapter) return;
    setSavingChapter(true);
    const token = localStorage.getItem("admin_token");
    try {
      const url = editingChapterSlug
        ? `${API_BASE_URL}/api/chapters/${encodeURIComponent(editingChapterSlug)}`
        : `${API_BASE_URL}/api/chapters`;
      const method = editingChapterSlug ? "PUT" : "POST";

      const bodyData = editingChapterSlug
        ? {
          name: chapterName,
          college: chapterCollege,
          location: chapterLocation,
          description: chapterDesc,
          cluster: chapterCluster,
        }
        : {
          name: chapterName,
          college: chapterCollege,
          location: chapterLocation,
          description: chapterDesc,
          cluster: chapterCluster,
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
        setChapterCluster("");
        setSubUsername("");
        setSubPassword("");
        setEditingChapterSlug(null);
        toast.success(editingChapterSlug ? "Chapter updated successfully." : "Chapter & Sub-Admin created successfully.");
        await fetchData();
      } else {
        toast.error(data.message || data.error || "Failed to save chapter.");
      }
    } catch (err) { toast.error(err instanceof Error ? err.message : "Request failed. Please retry."); } finally { setSavingChapter(false); }
  };


  const handleStartEditChapter = (chapter: DbChapter) => {
    setEditingChapterSlug(chapter.slug);
    setChapterName(chapter.name);
    setChapterCollege(chapter.college);
    setChapterLocation(chapter.location);
    setChapterDesc(chapter.description || "");
    setChapterCluster(chapter.cluster ? String(chapter.cluster) : "");
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
    setChapterCluster("");
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
    if (role === "superadmin") formData.append("featured", String(eventFeatured));
    formData.append("registrationLink", eventRegistrationLink);
    if (eventImageFile) {
      formData.append("image", eventImageFile);
    }

    const url = editingEventSlug
      ? `${API_BASE_URL}/api/events/${encodeURIComponent(editingEventSlug)}`
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
        toast.error(data.message || data.error || "Failed to save event.");
      }
    } catch (err) { toast.error(err instanceof Error ? err.message : "Request failed. Please retry."); } finally {
      setUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (slug: string) => {
    triggerConfirm("Are you sure you want to delete this event?", async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${encodeURIComponent(slug)}`, {
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
        toast.error(describeError(err));
      }
    });
  };

  const handleVerifyEvent = async (slug: string, status: "verified" | "rejected", reason: string = "") => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${encodeURIComponent(slug)}`, {
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
        toast.error(data.message || data.error || "Failed to update event status.");
      }
    } catch (err) { toast.error(err instanceof Error ? err.message : "Request failed. Please retry."); }
  };

  const handleStartEditEvent = (event: DbEvent) => {
    setEditingEventSlug(event.slug);
    setEventName(event.name);
    setEventDate(event.date.slice(0, 10));
    setEventLocation(event.location);
    setEventDesc(event.description.join("\n\n"));
    setEventFeatured(event.featured);
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
        const response = await fetch(`${API_BASE_URL}/api/chapters/${encodeURIComponent(slug)}`, {
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
        toast.error(describeError(err));
      }
    });
  };

  const displayedChapters = role === "superadmin"
    ? chapters
    : chapters.filter(c => c.slug === adminChapterSlug);

  const displayedEvents = role === "superadmin"
    ? events
    : events.filter(e => e.chapterSlug === adminChapterSlug);


  return { router, toast, fetch, loading, setLoading, adminUser, setAdminUser, role, setRole, adminChapterSlug, setAdminChapterSlug, chapters, setChapters, events, setEvents, myFeedback, setMyFeedback, subadmins, setSubadmins, subUsername, setSubUsername, subPassword, setSubPassword, editingSubPasswordUsername, setEditingSubPasswordUsername, newSubPassword, setNewSubPassword, errorMessage, setErrorMessage, chapterName, setChapterName, chapterCollege, setChapterCollege, chapterLocation, setChapterLocation, chapterDesc, setChapterDesc, chapterCluster, setChapterCluster, editingChapterSlug, setEditingChapterSlug, eventName, setEventName, eventChapter, setEventChapter, eventDate, setEventDate, eventLocation, setEventLocation, eventDesc, setEventDesc, eventRegistrationLink, setEventRegistrationLink, eventImageFile, imagePreviewUrl, setEventImageFile, editingEventImageUrl, setEditingEventImageUrl, uploadingEvent, setUploadingEvent, activeTab, setActiveTab, subChapterDesc, setSubChapterDesc, subChapterLogoFile, subChapterLogoPreview, setSubChapterLogoFile, uploadingChapterLogo, setUploadingChapterLogo, currentPassword, setCurrentPassword, mustChangePassword, setMustChangePassword, savingChapter, setSavingChapter, eventFeatured, setEventFeatured, clusters, setClusters, selfNewPassword, setSelfNewPassword, selfConfirmPassword, setSelfConfirmPassword, changingPassword, setChangingPassword, editingEventSlug, setEditingEventSlug, rejectingEventSlug, setRejectingEventSlug, rejectionReasonText, setRejectionReasonText, confirmModal, setConfirmModal, triggerConfirm, fetchSubadmins, fetchData, handleSignOut, handleDeleteSubadmin, handleUpdateSubPassword, handleSubAdminUpdateChapter, handleSelfPasswordChange, handleAddChapter, handleStartEditChapter, handleCancelEditChapter, handleAddEvent, handleDeleteEvent, handleVerifyEvent, handleStartEditEvent, handleCancelEdit, handleDeleteChapter, displayedChapters, displayedEvents };
}
