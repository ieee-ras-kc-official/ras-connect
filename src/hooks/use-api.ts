"use client";
import { readJson } from "@/config/api";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
// Preserve Response for existing forms, but reject failed/non-JSON responses before UI state changes.
export function useApi() {
  const router = useRouter();
  return useCallback(async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, init);
    try { await readJson<unknown>(response.clone()); }
    catch (error) { if (response.status === 401) router.replace("/login"); throw error; }
    return response;
  }, [router]);
}
