"use client";
import type { useDashboard } from "@/hooks/use-dashboard";
import { Key, Trash } from "@phosphor-icons/react";
export function SubAdminsPanel({ dashboard }: { dashboard: ReturnType<typeof useDashboard> }) {
  const { chapters, subadmins, editingSubPasswordUsername, setEditingSubPasswordUsername, newSubPassword, setNewSubPassword, handleDeleteSubadmin, handleUpdateSubPassword } = dashboard;
  return (<div className="border border-line p-6 bg-surface max-w-4xl">
    <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
      Registered Sub-Admins
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
      {subadmins.length === 0 ? (
        <p className="text-[11px] font-mono text-muted col-span-2">No sub-admin accounts created.</p>
      ) : (
        subadmins.map((sub) => (
          <div key={sub.username} className="flex flex-col justify-between gap-3 text-xs bg-surface-soft p-4 border border-line">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink uppercase font-mono">@{sub.username}</p>
                <p className="text-[10px] font-mono text-muted mt-0.5 uppercase tracking-tight">
                  {chapters.find((c) => c.slug === sub.chapterSlug)?.name || sub.chapterSlug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSubPasswordUsername(
                      editingSubPasswordUsername === sub.username ? null : sub.username
                    );
                    setNewSubPassword("");
                  }}
                  aria-label={`Change password for @${sub.username}`}
                  className="size-7 border border-line text-muted hover:text-ink hover:border-ink flex items-center justify-center transition-colors duration-155"
                >
                  <Key size={13} />
                </button>
                <button
                  aria-label={`Delete sub-admin ${sub.username}`}
                  onClick={() => handleDeleteSubadmin(sub.username)}
                  className="size-7 border border-line text-muted hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-colors duration-150"
                >
                  <Trash size={13} />
                </button>
              </div>
            </div>

            {editingSubPasswordUsername === sub.username && (
              <div className="border-t border-line pt-3 mt-1 flex items-center gap-2">
                <input
                  type="password" aria-label={`New password for ${sub.username}`} autoComplete="new-password" minLength={10} maxLength={72}
                  placeholder="New Password"
                  value={newSubPassword}
                  onChange={(e) => setNewSubPassword(e.target.value)}
                  className="flex-1 bg-transparent py-1 border-b border-line text-[11px] text-ink outline-none focus:border-brand"
                />
                <button
                  onClick={() => handleUpdateSubPassword(sub.username)}
                  className="px-2.5 py-1 bg-ink hover:bg-brand text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSubPasswordUsername(null)}
                  className="px-2.5 py-1 border border-line text-muted font-mono text-[9px] uppercase tracking-wider hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>);
}
