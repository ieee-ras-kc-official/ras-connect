import type { Metadata } from "next";
import { ArchivePageClient } from "./ArchivePageClient";

export const metadata: Metadata = {
  title: "Robotics Event Archive",
  description:
    "Browse the historic archive of robotics competitions, technical exhibitions, and learning milestones documented by IEEE RAS student branch chapters in Kerala.",
};

export default function ArchivePage() {
  return (
    <section className="min-h-[calc(100dvh-var(--header-height))] py-16 md:py-24">
      <div className="page-container">
        <div className="max-w-3xl">
          <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] text-brand sm:text-5xl lg:text-6xl">
            Event archive
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted">
            Past RAS Connect events, organized for easy browsing.
          </p>
        </div>
        <ArchivePageClient />
      </div>
    </section>
  );
}
