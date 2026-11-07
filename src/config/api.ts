const configured = process.env.NEXT_PUBLIC_API_URL;
if (!configured && process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_API_URL is required for production builds");
export const API_BASE_URL = (configured || "http://localhost:5000").replace(/\/$/, "");
const site = process.env.NEXT_PUBLIC_SITE_URL;
if (!site && process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds");
export const SITE_URL = (site || "http://localhost:3000").replace(/\/$/, "");
export function resolveMediaUrl(src?: string | null) {
  return src?.startsWith("/uploads/") ? `${API_BASE_URL}${src}` : src || "/card1.jpeg";
}
export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message); }
}
export function errorMessage(error: unknown, fallback = "Unable to complete this request. Please try again."): string {
  if (error instanceof TypeError) return "Cannot connect to the server. Check your connection and try again. Your entries have been kept.";
  return error instanceof Error ? error.message : fallback;
}
export async function readJson<T>(response: Response): Promise<T> {
  const data = response.headers.get("content-type")?.includes("application/json") ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token"); window.dispatchEvent(new Event("auth-change"));
      if (!window.location.pathname.startsWith("/login")) window.dispatchEvent(new Event("session-expired"));
    }
    const code = typeof data?.code === "string" ? data.code : undefined;
    const message = typeof data?.message === "string" ? data.message : typeof data?.error === "string" ? data.error : typeof data?.error?.message === "string" ? data.error.message : null;
    const defaults: Record<number, string> = {
      400: "Check the information entered and try again.",
      401: "Your session has expired. Please sign in again.",
      403: "Your account does not have permission for this action.",
      404: "This item could not be found. Refresh the page and try again.",
      409: "This item already exists or has changed. Refresh and check its current status.",
      413: "This file is too large. Event images must be under 4 MiB; feedback files must be under 5 MiB.",
      429: "Too many attempts. Please wait a few minutes before trying again.",
    };
    throw new ApiError(response.status, message || defaults[response.status] || "The server is temporarily unavailable. Please try again shortly.", code);
  }
  if (data === null) throw new ApiError(502, "The server returned an unexpected response. Please try again.");
  return data as T;
}
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return readJson<T>(await fetch(path.startsWith("http") ? path : `${API_BASE_URL}${path}`, init));
}
export async function apiList<T>(path: string, init?: RequestInit): Promise<T[]> {
  const data = await apiFetch<T[]>(path, init);
  if (!Array.isArray(data)) throw new ApiError(502, "The server returned invalid records.");
  return data;
}
