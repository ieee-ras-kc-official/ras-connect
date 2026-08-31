"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { Chapter } from "@/data/mock-data";

export function ChapterExplorer({ chapters }: { chapters: any[] }) {
  const reduceMotion = useReducedMotion();

  if (chapters.length === 0) {
    return (
      <div className="mt-12 border border-line p-8 bg-surface-soft text-center flex flex-col items-center justify-center min-h-[190px]">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink mb-2">
          No Chapters Created
        </h3>
        <p className="text-sm text-muted">
          No Student Branch Chapters have been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Local style block to hide scrollbars cleanly */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="mt-12 flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 no-scrollbar">
        {chapters.map((chapter, index) => (
          <motion.div
            key={chapter.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
            className="h-full shrink-0 w-[280px] sm:w-[320px] md:w-[calc((100%-24px*3)/4)] snap-start"
          >
            <Link
              href={`/chapters/${chapter.slug}`}
              className="group flex flex-col justify-between h-full min-h-[190px] border border-line bg-background p-6 hover:border-brand hover:bg-surface-soft/40 transition-all duration-300 relative select-none"
            >
              {/* Top info */}
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-brand/60 group-hover:text-brand tracking-wider transition-colors duration-200">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <ArrowRightIcon
                    size={16}
                    className="text-muted/40 group-hover:text-brand group-hover:translate-x-1 transition-all duration-200"
                  />
                </div>
                <h3 className="mt-4 text-pretty text-lg font-black leading-tight tracking-tight text-ink uppercase group-hover:text-brand transition-colors duration-150">
                  {chapter.name}
                </h3>
              </div>

              {/* Bottom info */}
              <div className="mt-6 border-t border-dashed border-line pt-4">
                <span className="block font-mono text-[10px] leading-relaxed uppercase tracking-wider text-muted/70 group-hover:text-ink transition-colors duration-150">
                  {chapter.college}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
