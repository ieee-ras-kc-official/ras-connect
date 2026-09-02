"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/config/api";

type ImageWithFallbackProps = {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ImageWithFallback({
  src,
  alt,
  className = "object-cover",
  priority = false,
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const rawSrc = src && src.trim() !== "" ? src : null;
  let resolvedSrc = rawSrc;

  if (rawSrc && rawSrc.startsWith("/uploads/")) {
    resolvedSrc = `${API_BASE_URL}${rawSrc}`;
  }

  const failed = Boolean(resolvedSrc && failedSrc === resolvedSrc);
  const finalSrc = !resolvedSrc || failed ? "/card1.jpeg" : resolvedSrc;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`w-full h-full ${className}`}
      onError={() => setFailedSrc(resolvedSrc)}
    />
  );
}
