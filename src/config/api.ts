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
  constructor(public status: number, message: string) { super(message); }
}
export async function readJson<T>(response: Response): Promise<T> {
  const data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token"); window.dispatchEvent(new Event("auth-change"));
      if (!window.location.pathname.startsWith("/login")) window.dispatchEvent(new Event("session-expired"));
    }
    throw new ApiError(response.status, data?.message || data?.error || `Request failed (${response.status}). Please try again.`);
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
