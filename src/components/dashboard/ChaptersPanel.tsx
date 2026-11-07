"use client";
import { resolveMediaUrl } from "@/config/api";
import type { useDashboard } from "@/hooks/use-dashboard";
import { Image as ImageIcon, Plus, Trash } from "@phosphor-icons/react";
import Image from "next/image";
export function ChaptersPanel({ dashboard }: { dashboard: ReturnType<typeof useDashboard> }) {
  const { toast, role, adminChapterSlug, chapters, subUsername, setSubUsername, subPassword, setSubPassword, chapterName, setChapterName, chapterCollege, setChapterCollege, chapterLocation, setChapterLocation, chapterDesc, setChapterDesc, chapterCluster, setChapterCluster, editingChapterSlug, subChapterDesc, setSubChapterDesc, subChapterLogoFile, subChapterLogoPreview, setSubChapterLogoFile, uploadingChapterLogo, savingChapter, clusters, handleSubAdminUpdateChapter, handleAddChapter, handleStartEditChapter, handleCancelEditChapter, handleDeleteChapter, displayedChapters } = dashboard;
  return (<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
    {/* Chapters list */}
    <div className="xl:col-span-7 space-y-6">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
          Student Branch Chapters
        </h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
          {displayedChapters.length === 0 ? (
            <p className="text-xs font-mono text-muted">No chapters logged yet.</p>
          ) : (
            displayedChapters.map((chapter) => (
              <div
                key={chapter.slug}
                className="border border-line p-4 bg-surface flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-11 bg-surface-soft border border-line shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    <Image
                      src={
                        chapter.logo && chapter.logo !== "/card1.jpeg"
                          ? (resolveMediaUrl(chapter.logo))
                          : "/images/brand/default-chapter-icon.svg"
                      }
                      alt={chapter.name}
                      className="max-h-full max-w-full object-contain"
                      width={640} height={640} loading="lazy" decoding="async" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink uppercase">{chapter.name}</h3>
                    <p className="text-[11px] text-muted font-mono mt-0.5">
                      {chapter.college} • {chapter.location}
                      {chapter.cluster ? ` • Cluster ${chapter.cluster}` : ""}
                    </p>
                  </div>
                </div>
                {role === "superadmin" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEditChapter(chapter)}
                      aria-label={`Edit chapter ${chapter.name}`}
                      className="size-8 border border-line text-muted hover:text-ink hover:border-ink flex items-center justify-center transition-colors duration-155"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter.slug)}
                      aria-label={`Delete chapter ${chapter.name}`}
                      className="size-8 border border-line text-muted hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-colors duration-155"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* Chapter Upload/Edit Form */}
    <div className="xl:col-span-5">
      {role === "superadmin" ? (
        <div id="chapter-form-section" className="border border-line p-6 bg-surface">
          <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
            {editingChapterSlug ? `Edit Chapter: ${editingChapterSlug}` : "Add New Chapter & Sub-Admin"}
          </h2>

          <form aria-busy={savingChapter} onSubmit={handleAddChapter} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-6">
                Chapter Name
              </label>
              <input id="dashboard-field-6"
                type="text"
                required
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                placeholder="e.g. Robotics Society MEC"
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              />
            </div>

            <div>
              <label htmlFor="dashboard-field-7" className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                College
              </label>
              <input id="dashboard-field-7"
                type="text"
                required
                value={chapterCollege}
                onChange={(e) => setChapterCollege(e.target.value)}
                placeholder="e.g. Govt Model Engineering College"
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              />
            </div>

            <div>
              <label htmlFor="dashboard-field-8" className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                Location
              </label>
              <input id="dashboard-field-8"
                type="text"
                required
                value={chapterLocation}
                onChange={(e) => setChapterLocation(e.target.value)}
                placeholder="e.g. Kochi, Kerala"
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              />
            </div>

            <div>
              <label htmlFor="dashboard-field-9" className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                Description
              </label>
              <textarea id="dashboard-field-9"
                value={chapterDesc}
                onChange={(e) => setChapterDesc(e.target.value)}
                placeholder="A student community exploring..."
                rows={2}
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors resize-none rounded-none"
              />
            </div>

            <div>
              <label htmlFor="chapter-cluster" className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                Cluster
              </label>
              <select
                id="chapter-cluster"
                value={chapterCluster}
                onChange={(e) => setChapterCluster(e.target.value)}
                className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
              >
                <option value="">No cluster (not on leaderboard)</option>
                {clusters.map(({ number: cluster }) => (
                  <option key={cluster} value={cluster}>
                    Cluster {cluster}
                  </option>
                ))}
              </select>
            </div>

            {!editingChapterSlug && (
              <>
                <div className="border-t border-line pt-4 mt-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand block mb-3">
                    {"// Associated Sub-Admin Account"}
                  </span>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-10">
                    Sub-Admin Username
                  </label>
                  <input id="dashboard-field-10"
                    type="text"
                    required
                    value={subUsername}
                    onChange={(e) => setSubUsername(e.target.value)}
                    placeholder="e.g. mec_admin"
                    className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-11">
                    Sub-Admin Password
                  </label>
                  <input id="dashboard-field-11"
                    type="password" minLength={10} maxLength={72} autoComplete="new-password"
                    required
                    value={subPassword}
                    onChange={(e) => setSubPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
                  />
                </div>
              </>
            )}


            <div className="flex gap-4 mt-4">
              {editingChapterSlug && (
                <button
                  type="button"
                  onClick={handleCancelEditChapter}
                  className="w-1/2 min-h-12 border border-ink text-ink font-mono text-xs uppercase tracking-wider transition-colors hover:bg-surface-soft rounded-none flex items-center justify-center"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit" disabled={savingChapter}
                className={`${editingChapterSlug ? "w-1/2" : "w-full"} min-h-12 bg-ink text-white font-mono text-xs uppercase tracking-wider transition-colors hover:bg-brand rounded-none flex items-center justify-center gap-2`}
              >
                {editingChapterSlug ? (
                  <>
                    <Plus size={14} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Create Chapter & Sub-Admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border border-line p-6 bg-surface">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-brand block mb-2">
            {"// Chapter Profile & Branding"}
          </span>
          <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
            My Chapter Logo & Bio
          </h2>

          {(() => {
            const currentChapter = chapters.find((c) => c.slug === adminChapterSlug);
            return (
              <form onSubmit={handleSubAdminUpdateChapter} className="space-y-5">
                {/* Current Chapter Name & Info */}
                <div className="bg-surface-soft p-3 border border-line">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted block mb-0.5">
                    Host Chapter
                  </span>
                  <p className="text-sm font-bold uppercase text-brand font-mono">
                    {currentChapter?.name || adminChapterSlug}
                  </p>
                  <p className="text-[11px] font-mono text-muted mt-0.5">
                    {currentChapter?.college} • {currentChapter?.location}
                  </p>
                </div>

                {/* Current Logo Display */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2">Chapter Logo Preview</span>
                  <div className="flex items-center gap-4">
                    <div className="size-20 border border-line bg-surface-soft p-2 flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src={
                          subChapterLogoPreview ||
                          (currentChapter?.logo && currentChapter.logo !== "/card1.jpeg"
                            ? resolveMediaUrl(currentChapter.logo)
                            : "/images/brand/default-chapter-icon.svg")
                        }
                        alt="Chapter Logo"
                        className="max-h-full max-w-full object-contain"
                        width={640} height={640} loading="lazy" decoding="async" />
                    </div>
                    <div className="text-xs font-mono text-muted leading-relaxed">
                      {subChapterLogoPreview
                        ? "New logo selected (previewing)"
                        : currentChapter?.logo && currentChapter.logo !== "/card1.jpeg"
                          ? "Custom logo uploaded"
                          : "Default chapter icon in use"}
                    </div>
                  </div>
                </div>

                {/* Logo file input */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2" htmlFor="sub-chapter-logo">
                    Upload New Chapter Logo
                  </label>
                  <div className="border border-dashed border-line p-4 text-center cursor-pointer hover:bg-surface-soft transition-colors relative flex flex-col items-center gap-2">
                    <ImageIcon size={24} className="text-muted" />
                    <span className="text-xs text-muted font-mono">
                      {subChapterLogoFile ? subChapterLogoFile.name : "Select PNG / JPG / WebP logo (Square recommended, under 4MB)"}
                    </span>
                    <input
                      id="sub-chapter-logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          if (file.size > 4 * 1024 * 1024) {
                            toast.error("Upload under 4MB");
                            e.target.value = "";
                            setSubChapterLogoFile(null);
                          } else {
                            setSubChapterLogoFile(file);
                          }
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                {/* Description input */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="sub-chapter-description">Chapter Description / Bio</label>
                  <textarea id="sub-chapter-description"
                    value={subChapterDesc}
                    onChange={(e) => setSubChapterDesc(e.target.value)}
                    placeholder="Describe your student branch chapter activities, team, and focus..."
                    rows={3}
                    className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors resize-none rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadingChapterLogo}
                  className="w-full min-h-12 bg-ink text-white font-mono text-xs uppercase tracking-wider transition-colors hover:bg-brand disabled:opacity-50 rounded-none flex items-center justify-center gap-2 mt-4"
                >
                  {uploadingChapterLogo ? (
                    <span className="animate-pulse">Uploading to Cloudinary...</span>
                  ) : (
                    <>
                      <Plus size={14} />
                      Save Chapter Logo & Bio
                    </>
                  )}
                </button>
              </form>
            );
          })()}
        </div>
      )}
    </div>
  </div>);
}
