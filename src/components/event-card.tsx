"use client";
import Image from "next/image";

import { resolveMediaUrl } from "@/config/api";
import type { RasEvent } from "@/types/api";
import { formatEventDate, isEventPassed } from "@/utils/date";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

type EventCardProps = {
  event: RasEvent;
  className?: string;
  priority?: boolean;
  index?: number;
};

export function EventCard({
  event,
  className = "",
  index = 0,
  priority = false,
}: EventCardProps) {
  const reduceMotion = useReducedMotion();

  const dateStr = event.date;
  const isArchived = isEventPassed(event.date);
  const eventYear = /^\d{4}-/.test(event.date) ? event.date.slice(0, 4) : "";

  const [failed, setFailed] = useState(false);

  const hasImage = event.image && !failed;
  const imageSrc = hasImage ? resolveMediaUrl(event.image) : "/card1.jpeg";

  return (
    <motion.article
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.35,
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.05,
        ease: [0.2, 0, 0, 1],
      }}
      className={`h-full ${className}`}
    >
      <Link
        href={`/events/${event.slug}`}
        className={`group flex flex-col justify-between h-full min-h-[340px] p-5 border transition-all duration-300 relative ${isArchived
            ? "border-line bg-surface-soft/60 hover:bg-surface-soft/90 hover:border-muted"
            : "border-line bg-background hover:border-brand hover:shadow-soft hover:bg-surface-soft/20"
          }`}
      >
        {/* Top Content: Image & Title */}
        <div>
          {/* Image Wrapper */}
          <div className="relative aspect-square overflow-hidden bg-surface-soft border border-line shrink-0">
            <Image
              width={640} height={640}
              loading={priority ? "eager" : "lazy"} decoding="async"
              src={imageSrc}
              alt={event.imageAlt || "Event poster"}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-brand motion-safe:group-hover:scale-[1.03] ${isArchived ? "grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100" : ""
                }`}
              onError={() => setFailed(true)}
            />
          </div>

          {/* Title and Index */}
          <div className="mt-4 flex items-center gap-2.5 min-w-0">
            <span className={`font-mono text-xs transition-colors duration-200 shrink-0 ${isArchived ? "text-muted/50 group-hover:text-muted" : "text-brand/60 group-hover:text-brand"
              }`}>
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <h3 className={`text-sm font-bold uppercase transition-colors duration-150 truncate ${isArchived
                ? "text-muted group-hover:text-ink"
                : "text-ink group-hover:text-brand"
              }`} title={event.name}>
              {event.name}
            </h3>
          </div>
        </div>

        {/* Bottom Content: Meta details */}
        <div className="mt-6 border-t border-dashed border-line pt-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            {isArchived ? (
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted/80 bg-surface-strong px-2 py-0.5 border border-line">
                ARCHIVED {eventYear ? `// ${eventYear}` : ""}
              </span>
            ) : (
              <span className="font-mono text-[9px] uppercase tracking-wider text-white bg-brand px-2 py-0.5">
                ACTIVE
              </span>
            )}

            {dateStr && (
              <span className={`font-mono text-[9px] uppercase tracking-wider ${isArchived ? "text-muted/65" : "text-accent/80 font-bold"
                }`}>
                {formatEventDate(dateStr)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
