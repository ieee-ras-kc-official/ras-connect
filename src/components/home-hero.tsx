"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { events as allEvents, chapters as allChapters, type RasEvent } from "@/data/mock-data";

type HomeHeroProps = {
  events?: RasEvent[];
};

export function HomeHero({ events }: HomeHeroProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [isHovered, setIsHovered] = useState(false);

  // Default to first 4 featured, unarchived events if none passed
  const displayEvents = events ?? allEvents
    .filter((event) => event.featured && !event.archived)
    .slice(0, 4);

  const activeEvent = displayEvents[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayEvents.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + displayEvents.length) % displayEvents.length);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play sliding, pausing on hover
  useEffect(() => {
    if (isHovered || reduceMotion) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered, reduceMotion]);

  if (!activeEvent) return null;

  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
      };

  // Slide variants for carousel
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <section className="border-b border-line bg-background relative overflow-hidden">
      {/* Subtle technical crosshair and grid markings in the background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none" aria-hidden="true">
        <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-ink" />
        <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-ink" />
        <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-ink" />
        <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-ink" />
        {/* Horizontal grid lines */}
        <div className="absolute top-[20%] left-0 w-full border-t border-dashed border-ink/40" />
        <div className="absolute top-[80%] left-0 w-full border-t border-dashed border-ink/40" />
      </div>

      <div className="page-container flex flex-col md:grid md:grid-cols-12 md:items-stretch border-x border-line relative z-10">
        
        {/* Left Panel: Hero Content */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-center min-h-[calc(100dvh-var(--header-height))] md:min-h-0 py-6 px-4 md:px-0 md:py-10 md:pr-8 lg:pr-14 md:border-r md:border-line">

          {/* Label with Swiss square bullet */}
          <motion.div
            {...entrance}
            transition={{ duration: 0.35, delay: 0.02, ease: [0.2, 0, 0, 1] }}
            className="flex items-center gap-3"
          >
            <span className="inline-block size-2.5 bg-brand rounded-none shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-brand">
              IEEE RAS Kerala Chapter
            </span>
          </motion.div>
          
          {/* Giant Stark Swiss Typography (Fluid sizes to prevent squeeze) */}
          <motion.h1
            {...entrance}
            transition={{ duration: 0.42, delay: reduceMotion ? 0 : 0.05, ease: [0.2, 0, 0, 1] }}
            className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] text-ink sm:text-7xl md:text-7xl lg:text-8xl xl:text-[104px] uppercase flex flex-col select-none"
          >
            <span className="flex items-center">
              RAS<span className="text-brand font-mono font-light mx-1">/</span>
            </span>
            <span className="text-brand-deep">CONNECT<span className="text-accent font-sans">.</span></span>
          </motion.h1>
          
          {/* Stark solid horizontal line separator */}
          <motion.div
            initial={reduceMotion ? {} : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="origin-left border-t border-ink/30 my-4 w-full"
          />

          <motion.p
            {...entrance}
            transition={{ duration: 0.42, delay: reduceMotion ? 0 : 0.12, ease: [0.2, 0, 0, 1] }}
            className="text-pretty text-base leading-relaxed text-muted max-w-md md:text-lg"
          >
            A statewide showcase of robotics events led by IEEE RAS student chapters across Kerala.
          </motion.p>
          
          {/* Stark statistics display */}
          <motion.div
            {...entrance}
            transition={{ duration: 0.42, delay: reduceMotion ? 0 : 0.15, ease: [0.2, 0, 0, 1] }}
            className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-3 w-full max-w-md"
          >
            <div>
              <span className="font-mono text-3xl font-extrabold tracking-tight text-brand">
                {String(allChapters.length).padStart(2, "0")}
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-muted mt-1">
                // SB CHAPTERS ACTIVE
              </span>
            </div>
            <div className="border-l border-line pl-6">
              <span className="font-mono text-3xl font-extrabold tracking-tight text-brand">
                {String(allEvents.length).padStart(2, "0")}
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-muted mt-1">
                // EVENTS LOGGED
              </span>
            </div>
          </motion.div>

          {/* Stark Minimalist Buttons */}
          <motion.div
            {...entrance}
            transition={{ duration: 0.42, delay: reduceMotion ? 0 : 0.18, ease: [0.2, 0, 0, 1] }}
            className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-md sm:max-w-none"
          >
            <Link
              href="/chapters"
              className="group inline-flex min-h-12 w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-none border border-ink bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-brand hover:border-brand active:bg-brand-deep cursor-pointer"
            >
              Explore chapters
            </Link>
            <Link
              href="/archive"
              className="group inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-none border border-ink bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-brand transition-all duration-300 hover:bg-ink hover:text-white hover:border-ink cursor-pointer"
            >
              View archive
              <ArrowRightIcon size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right Panel: Event Cards Slider */}
        <div 
          className="col-span-12 md:col-span-6 flex flex-col justify-center py-12 px-4 md:px-0 md:py-10 md:pl-8 lg:pl-14 border-t border-line md:border-t-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Centered card container */}
          <div className="w-full max-w-[380px] mx-auto">
            {/* Slider Header */}
            <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted/70">
                Featured Events // Slide
              </span>
              <div className="flex items-center gap-4">
                {displayEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className={`font-mono text-xs transition-all duration-200 cursor-pointer ${
                      i === currentIndex
                        ? "text-brand font-bold border-b border-brand pb-0.5"
                        : "text-muted/60 hover:text-ink"
                    }`}
                  >
                    {(i + 1).toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Animated Slider Container */}
            <div className="relative overflow-hidden w-full min-h-[350px] sm:min-h-[425px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 280, damping: 30 },
                    opacity: { duration: 0.16 }
                  }}
                  className="absolute inset-0 flex flex-col"
                >
                  {/* Image Container with Sharp Corners */}
                  <div className="relative aspect-square w-full overflow-hidden bg-surface-soft border border-line rounded-none">
                    <Link href={`/events/${activeEvent.slug}`} className="group block w-full h-full">
                      <ImageWithFallback
                        src={activeEvent.image}
                        alt={activeEvent.imageAlt}
                        sizes="(max-width: 767px) 100vw, 50vw"
                        priority
                        className="object-cover w-full h-full transition-transform duration-500 ease-brand motion-safe:group-hover:scale-[1.03]"
                      />
                    </Link>
                  </div>
                  
                  {/* Event Name Text with Sharp Swiss layout */}
                  <div className="pt-3 flex items-start gap-4">
                    <span className="font-mono text-[11px] font-medium tracking-wider text-muted/70 mt-1.5">
                      {(currentIndex + 1).toString().padStart(2, "0")}.
                    </span>
                    <div className="flex-1">
                      <Link href={`/events/${activeEvent.slug}`} className="group inline-block">
                        <h3 className="text-pretty text-xl font-extrabold leading-tight tracking-tight text-ink uppercase group-hover:text-brand transition-colors duration-150 md:text-2xl">
                          {activeEvent.name}
                        </h3>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Bottom Controls */}
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous event"
                  className="inline-flex size-10 items-center justify-center border border-ink bg-transparent text-ink hover:bg-ink hover:text-white transition-colors duration-150 rounded-none cursor-pointer"
                >
                  <ArrowLeftIcon size={16} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next event"
                  className="inline-flex size-10 items-center justify-center border border-ink bg-transparent text-ink hover:bg-ink hover:text-white transition-colors duration-150 rounded-none cursor-pointer"
                >
                  <ArrowRightIcon size={16} />
                </button>
              </div>
              <div className="font-mono text-xs font-semibold text-muted/70">
                {currentIndex + 1} / {displayEvents.length}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
