"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

const navigation = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  {
    label: "Events",
    href: "/events",
    match: (path: string) => path.startsWith("/events"),
  },
  {
    label: "Chapters",
    href: "/chapters",
    match: (path: string) => path.startsWith("/chapters"),
  },
  {
    label: "Archive",
    href: "/archive",
    match: (path: string) => path.startsWith("/archive"),
  },
  {
    label: "Login",
    href: "/login",
    match: (path: string) => path.startsWith("/login"),
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[70] -translate-y-24 rounded-[10px] bg-brand px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 h-[var(--header-height)] border-b border-line/80 bg-background/95 backdrop-blur-md">
        <div className="page-container flex h-full items-center justify-between gap-5">
          <Link
            href="/"
            aria-label="RAS Connect home"
            onClick={() => setOpen(false)}
            className="flex min-w-0 items-center gap-3 rounded-sm"
          >
            <BrandLogo compact />
          </Link>

          <nav aria-label="Primary navigation" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navigation.map((item) => {
                const active = item.match(pathname);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block py-2 text-[15px] font-medium transition-colors duration-150 hover:text-brand ${
                        active ? "text-brand" : "text-muted"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-accent transition-transform duration-200 ease-brand ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center bg-transparent text-ink hover:text-brand transition-colors md:hidden focus:outline-none focus-visible:outline-none relative"
          >
            <div className="flex flex-col items-end gap-1.5 w-5 h-5 justify-center relative">
              <motion.span
                animate={open ? { rotate: 45, y: 6, width: "20px" } : { rotate: 0, y: 0, width: "16px" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-0.5 bg-current block origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="h-0.5 w-5 bg-current block"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6, width: "20px" } : { rotate: 0, y: 0, width: "10px" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-0.5 bg-current block origin-center"
              />
            </div>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-30 bg-background px-5 py-8 md:hidden"
          >
            <ul className="mx-auto flex max-w-md flex-col">
              {navigation.map((item, index) => {
                const active = item.match(pathname);
                return (
                  <motion.li
                    key={item.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : index * 0.04,
                      duration: 0.28,
                      ease: [0.2, 0, 0, 1],
                    }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex min-h-16 items-center text-xl font-semibold ${
                        active ? "text-brand" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
