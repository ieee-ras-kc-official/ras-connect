"use client";

import { useState } from "react";
import { Preloader } from "./preloader";
import { motion } from "motion/react";

export function PageRevealWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: loaded ? "auto" : "none" }}
      >
        {children}
      </motion.div>
    </>
  );
}
