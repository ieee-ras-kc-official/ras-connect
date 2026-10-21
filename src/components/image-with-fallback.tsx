"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/config/api";

type ImageWithFallbackProps = {
  src: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/brand/default-chapter-icon.svg",
  className = "object-cover",
  priority = false,
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const rawSrc = src && src.trim() !== "" ? src : null;
  let resolvedSrc = rawSrc;

  if (rawSrc && rawSrc.startsWith("/uploads/")) {
    resolvedSrc = `${API_BASE_URL}${rawSrc}`;
  }

  // If rawSrc was the old mock card1.jpeg, use default chapter icon fallback
  if (resolvedSrc === "/card1.jpeg" && fallbackSrc !== "/card1.jpeg") {
    resolvedSrc = fallbackSrc;
  }

  const failed = Boolean(resolvedSrc && failedSrc === resolvedSrc);
  const finalSrc = !resolvedSrc || failed ? fallbackSrc : resolvedSrc;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`w-full h-full ${className}`}
      onError={() => setFailedSrc(resolvedSrc)}
    />
  );
}
