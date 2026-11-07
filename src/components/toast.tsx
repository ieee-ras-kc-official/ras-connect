"use client";

import { CheckCircle, Info, X, XCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => { const active = timers.current; return () => { active.forEach(clearTimeout); active.clear(); }; }, []);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Keep errors visible until dismissed so users can read and correct them.
    if (type !== "error") timers.current.set(id, setTimeout(() => {
      removeToast(id);
    }, 4000));
  }, [removeToast]);

  const toast = React.useMemo(() => ({
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container */}
      <div aria-live="polite" aria-relevant="additions" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-[calc(100%-48px)] sm:max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="pointer-events-auto w-full bg-surface border border-line p-4 flex items-start gap-3 shadow-soft rounded-none"
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {t.type === "success" && <CheckCircle size={18} className="text-emerald-600" />}
                {t.type === "error" && <XCircle size={18} className="text-rose-600" />}
                {t.type === "info" && <Info size={18} className="text-brand" />}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted mb-0.5">
                  {t.type === "error" ? "Action needed" : t.type === "success" ? "Success" : "Information"}
                </p>
                <p className="text-xs text-ink font-mono font-medium leading-relaxed break-words">
                  {t.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-muted hover:text-ink transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
