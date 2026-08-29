import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  MapPinIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EventCard } from "@/components/event-card";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Reveal } from "@/components/reveal";
import {
  events,
  getEvent,
  getEventChapter,
} from "@/data/mock-data";

type EventPageProps = {
  params: Promise<{ eventSlug: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ eventSlug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = getEvent(eventSlug);
  if (!event) return {};
  return {
    title: event.name,
    description: event.description[0],
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params;
  const event = getEvent(eventSlug);
  if (!event) notFound();
  const chapter = getEventChapter(event);
  if (!chapter) notFound();

  const relatedEvents = events
    .filter(
      (candidate) =>
        candidate.chapterSlug === chapter.slug && candidate.slug !== event.slug,
    )
    .slice(0, 5);
  const gallery = event.gallery.slice(0, 3);

  return (
    <>
      <article className="pb-16 pt-8 md:pb-24 md:pt-10">
        <div className="page-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Chapters", href: "/chapters" },
              { label: chapter.name, href: `/chapters/${chapter.slug}` },
              { label: event.name },
            ]}
          />

          <div className="mt-9 grid gap-9 lg:grid-cols-12 lg:items-start lg:gap-12">
            <Reveal className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative aspect-square w-full max-w-[340px] overflow-hidden border border-line bg-surface-soft rounded-none flex items-center justify-center">
                <ImageWithFallback
                  src={event.image}
                  alt={event.imageAlt}
                  sizes="(max-width: 1023px) 100vw, 30vw"
                  priority
                  className="object-contain w-full h-full p-2"
                />
              </div>
            </Reveal>

            <Reveal className="lg:col-span-8" delay={0.06}>
              <h1 className="text-balance text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl uppercase">
                {event.name}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                Organized by{" "}
                <Link
                  href={`/chapters/${chapter.slug}`}
                  className="font-bold text-brand transition-colors hover:text-accent"
                >
                  {chapter.name}
                </Link>
              </p>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.date ? (
                  <div className="flex items-center gap-3 border border-line bg-surface p-3 rounded-none">
                    <span className="grid size-9 place-items-center border border-line bg-surface-soft text-brand rounded-none shrink-0">
                      <CalendarBlankIcon size={18} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-muted">
                        Date
                      </dt>
                      <dd className="mt-0.5 text-xs font-bold text-ink truncate">
                        <time dateTime={event.date.iso}>{event.date.label}</time>
                      </dd>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-3 border border-line bg-surface p-3 rounded-none">
                  <span className="grid size-9 place-items-center border border-line bg-surface-soft text-brand rounded-none shrink-0">
                    <MapPinIcon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-muted">
                      Location
                    </dt>
                    <dd className="mt-0.5 text-xs font-bold text-ink truncate">
                      {event.location}
                    </dd>
                  </div>
                </div>
              </dl>

              <section className="mt-8 border-t border-line pt-6" aria-labelledby="about-event-heading">
                <h2 id="about-event-heading" className="text-xl font-bold uppercase tracking-tight text-ink">
                  About the event
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
                  {event.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          </div>

          {gallery.length ? (
            <section className="mt-16 border-t border-line pt-12 md:mt-20 md:pt-16" aria-labelledby="gallery-heading">
              <Reveal>
                <h2 id="gallery-heading" className="text-3xl font-bold tracking-[-0.025em] text-ink">
                  Gallery
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-4 md:grid-cols-12 md:grid-rows-2">
                {gallery.map((image, index) => (
                  <Reveal
                    key={image.src}
                    delay={index * 0.05}
                    className={
                      index === 0
                        ? "relative min-h-72 overflow-hidden border border-line bg-surface-soft md:col-span-7 md:row-span-2 md:min-h-[460px] rounded-none"
                        : "relative min-h-56 overflow-hidden border border-line bg-surface-soft md:col-span-5 md:min-h-0 rounded-none"
                    }
                  >
                    <ImageWithFallback
                      src={image.src}
                      alt={image.alt}
                      sizes={index === 0 ? "(max-width: 767px) 100vw, 58vw" : "(max-width: 767px) 100vw, 42vw"}
                      className="object-cover"
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      {relatedEvents.length ? (
        <section className="border-t border-line bg-background py-10 md:py-12" aria-labelledby="related-events-heading">
          <div className="page-container">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2
                id="related-events-heading"
                className="text-xl font-bold uppercase tracking-tight text-ink"
              >
                More from {chapter.name}
              </h2>
              <Link
                href={`/chapters/${chapter.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand transition-colors hover:text-accent rounded-none"
              >
                <ArrowLeftIcon size={14} aria-hidden="true" />
                Back to chapter
              </Link>
            </div>
            <div className="mt-6 no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-4 pt-1 gap-6">
              {relatedEvents.map((related, index) => (
                <div
                  key={related.slug}
                  className="shrink-0 w-[280px] sm:w-[300px] snap-start"
                >
                  <EventCard event={related} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
