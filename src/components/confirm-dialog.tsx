"use client";
import { useEffect, useRef, useState } from "react";
export function ConfirmDialog({ open, message, onCancel, onConfirm }: { open: boolean; message: string; onCancel: () => void; onConfirm: () => void | Promise<void> }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const running = useRef(false);
  useEffect(() => { if (open && !ref.current?.open) ref.current?.showModal(); else if (!open) ref.current?.close(); }, [open]);
  return <dialog ref={ref} aria-modal="true" aria-labelledby="confirm-title" onCancel={e => { if (running.current) e.preventDefault(); else onCancel(); }} className="m-auto border border-line bg-surface p-6 text-ink backdrop:bg-black/40">
    <h2 id="confirm-title" className="mb-6 max-w-sm">{message}</h2>
    <div className="flex justify-end gap-4"><button disabled={busy} onClick={onCancel}>Cancel</button><button disabled={busy} onClick={async () => { if (running.current) return; running.current = true; setBusy(true); try { await onConfirm(); } finally { running.current = false; setBusy(false); } }}>{busy ? "Working…" : "Proceed"}</button></div>
  </dialog>;
}
