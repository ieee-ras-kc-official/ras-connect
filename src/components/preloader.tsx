"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type PreloaderProps = {
  onComplete?: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const finishLoading = () => {
      setLoading(false);
      if (onComplete) {
        setTimeout(onComplete, 400); // Trigger after the exit animation completes
      }
    };

    if (document.readyState === "complete") {
      const timer = setTimeout(finishLoading, 1200);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => {
        setTimeout(finishLoading, 800);
      };
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center px-6">
            {/* Pulsing logo */}
            <div className="relative w-[280px] sm:w-[320px] aspect-[722/69] animate-preloader-pulse">
              <Image
                src="/images/brand/ieee-ras-logo.png"
                alt="IEEE RAS Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
