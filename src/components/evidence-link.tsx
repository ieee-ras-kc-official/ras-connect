"use client";
import { useToast } from "@/components/toast";
import { apiFetch } from "@/config/api";
import type { Attachment } from "@/utils/feedback";
export function EvidenceLink({ attachment }: { attachment: Attachment }) {
  const toast = useToast();
  return <button type="button" className="text-brand underline" onClick={async () => {
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    try {
      const { url } = await apiFetch<{ url: string }>(attachment.url, { headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` } });
      if (tab) tab.location.replace(url);
    } catch (error) { tab?.close(); toast.error(error instanceof Error ? error.message : "Unable to open attachment."); }
  }}>{attachment.name || "View attachment"}</button>;
}
