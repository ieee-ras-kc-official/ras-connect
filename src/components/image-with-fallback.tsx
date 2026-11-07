"use client";
import Image from "next/image";

import { resolveMediaUrl } from "@/config/api";
import { useState } from "react";

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
  fallbackSrc = "/card1.jpeg",
  className = "object-cover",
  priority = false,
  sizes,
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const rawSrc = src && src.trim() !== "" ? src : null;
  const resolvedSrc = rawSrc ? resolveMediaUrl(rawSrc) : null;

  const failed = Boolean(resolvedSrc && failedSrc === resolvedSrc);
  const finalSrc = !resolvedSrc || failed ? fallbackSrc : resolvedSrc;

  return (
    <Image
      width={640}
      height={640}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      src={finalSrc}
      alt={alt}
      className={`w-full h-full ${className}`}
      onError={() => setFailedSrc(resolvedSrc)}
    />
  );
}
