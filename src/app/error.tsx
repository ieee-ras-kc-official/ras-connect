"use client";

import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center px-5 py-16">
      <div className="w-full max-w-2xl rounded-[14px] border border-line bg-surface px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
        <span className="mx-auto grid size-14 place-items-center rounded-[14px] bg-surface-soft text-accent">
          <WarningCircleIcon size={27} aria-hidden="true" />
        </span>
        <h1 className="mt-7 text-balance text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
          This page could not be displayed.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-7 text-muted">
          The error has been surfaced in the browser console. Try loading the page again.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-brand px-6 text-sm font-bold text-white transition-[background-color,transform] hover:bg-brand-deep active:scale-[0.98]"
          >
            <ArrowClockwiseIcon size={18} aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-[10px] border border-line bg-background px-6 text-sm font-bold text-brand transition-[background-color,transform] hover:bg-surface-soft active:scale-[0.98]"
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
