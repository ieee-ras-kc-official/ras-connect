"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface select-none">
      {/* Top Grid Area */}
      <div className="page-container py-12 md:py-16 grid gap-8 grid-cols-1 md:grid-cols-12">
        {/* Col 1: Brand & Logo */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Empowering student communities across Kerala to innovate, collaborate, and push the boundaries of robotics and automation.
            </p>
          </div>
          {/* Status info */}
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-block size-2 rounded-none bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              All systems operational | IEEE RAS KC
            </span>
          </div>
        </div>

        {/* Group Directory and Connections in a 2-column grid on mobile */}
        <div className="grid grid-cols-2 gap-6 md:col-span-7 border-t border-line pt-8 md:pt-0 md:border-t-0 md:grid-cols-12 md:gap-0">
          {/* Col 2: Navigation (Index) */}
          <div className="md:col-span-5 md:border-l border-line md:pl-8">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
              Directory
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-brand transition-colors font-bold uppercase tracking-tight text-xs">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted hover:text-brand transition-colors font-bold uppercase tracking-tight text-xs">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/chapters" className="text-muted hover:text-brand transition-colors font-bold uppercase tracking-tight text-xs">
                  Chapters
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-muted hover:text-brand transition-colors font-bold uppercase tracking-tight text-xs">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Connections */}
          <div className="md:col-span-7 border-l border-line pl-6 md:pl-8">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
              Connections
            </h4>
            <p className="mt-4 text-xs text-muted leading-relaxed hidden sm:block md:hidden lg:block">
              Have questions about events or chapters? Reach out to us.
            </p>
            <div className="mt-4 flex flex-col gap-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-muted">
              <a href="https://ras.ieeekerala.org/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors w-fit block truncate">
                W: ras.ieeekerala.org
              </a>
            </div>

            {/* Social Links Block */}
            <div className="mt-6 border-t border-line/60 pt-4">
              <h5 className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-brand/80 mb-2.5">
                Social Channels
              </h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider">
                <a href="https://www.linkedin.com/company/ieee-robotics-and-automation-society-kerala-chapter/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand transition-colors flex items-center gap-1.5 w-fit">
                  <span className="inline-block size-1 bg-brand rounded-none shrink-0" />
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/ieeeraskc/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand transition-colors flex items-center gap-1.5 w-fit">
                  <span className="inline-block size-1 bg-brand rounded-none shrink-0" />
                  Instagram
                </a>
                <a href="https://youtube.com/@ieeeraskeralachapter5056" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand transition-colors flex items-center gap-1.5 w-fit">
                  <span className="inline-block size-1 bg-brand rounded-none shrink-0" />
                  YouTube
                </a>
                <a href="https://twitter.com/ieeerasks/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand transition-colors flex items-center gap-1.5 w-fit">
                  <span className="inline-block size-1 bg-brand rounded-none shrink-0" />
                  Twitter
                </a>
                <a href="https://whatsapp.com/channel/0029VaZmQVh4tRroaJv74B1h" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand transition-colors flex items-center gap-1.5 w-fit">
                  <span className="inline-block size-1 bg-brand rounded-none shrink-0" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line bg-surface-soft/20 py-6">
        <div className="page-container flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left gap-4">
          <p className="text-xs text-muted font-mono leading-relaxed">
            © {new Date().getFullYear()} IEEE RAS KERALA SECTION<br />
            ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 font-mono text-[10px] text-muted justify-center">
            <span>[ SWISS MINI-DESIGN ]</span>
            <span>[ VERSION 2.3 ]</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
