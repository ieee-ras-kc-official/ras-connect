"use client";

import { ImageBrokenIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = {
  src: string | null;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
};

export function ImageWithFallback({
  src,
  alt,
  className = "object-cover",
  sizes,
  priority = false,
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = Boolean(src && failedSrc === src);

  const finalSrc = !src || failed ? "/card1.jpeg" : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
