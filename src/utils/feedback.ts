import { API_BASE_URL } from "@/config/api";

export type FeedbackStatus = "pending" | "verified" | "rejected";

export type Attachment = {
  url: string;
  name: string;
};

export type CollaboratingChapter = {
  _id: string;
  name: string;
  college: string;
};

export type Feedback = {
  _id: string;
  event: { name: string; slug: string; chapterSlug: string; date: string; status: string };
  eventDetails: string;
  collaboratingChapters: CollaboratingChapter[];
  participants: number;
  rasMembers: number;
  photos: Attachment[];
  attendance: Attachment;
  points: { collaboration: number; participants: number; rasMembers: number; total: number };
  status: FeedbackStatus;
  reviewNote: string;
  submittedBy: string;
};

export const attachmentUrl = (url: string) =>
  url.startsWith("/uploads/") ? `${API_BASE_URL}${url}` : url;

export const STATUS_BADGE: Record<FeedbackStatus, string> = {
  pending: "text-amber-700 bg-amber-50 border-amber-300",
  verified: "text-emerald-700 bg-emerald-50 border-emerald-300",
  rejected: "text-rose-700 bg-rose-50 border-rose-300",
};
