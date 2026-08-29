import { ArrowRightIcon, CompassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center px-5 py-16">
      <div className="w-full max-w-2xl rounded-[14px] border border-line bg-surface px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
        <span className="mx-auto grid size-14 place-items-center rounded-[14px] bg-surface-soft text-brand">
          <CompassIcon size={27} aria-hidden="true" />
        </span>
        <p className="mt-7 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent">
          Page not found
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
          This route is outside the showcase.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-7 text-muted">
          The chapter or event may have moved, or the address may be incomplete.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/chapters"
            className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-brand px-6 text-sm font-bold text-white transition-[background-color,transform] hover:bg-brand-deep active:scale-[0.98]"
          >
            Browse chapters
            <ArrowRightIcon size={18} aria-hidden="true" />
          </Link>
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
