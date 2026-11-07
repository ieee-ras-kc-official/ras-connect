"use client";
import { ClusterManagerPanel } from "@/components/cluster-manager-panel";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AccountPanel } from "@/components/dashboard/AccountPanel";
import { ChaptersPanel } from "@/components/dashboard/ChaptersPanel";
import { EventsPanel } from "@/components/dashboard/EventsPanel";
import { SubAdminsPanel } from "@/components/dashboard/SubAdminsPanel";
import { FeedbackReviewPanel } from "@/components/feedback-review-panel";
import { useDashboard } from "@/hooks/use-dashboard";
import { isEventPassed } from "@/utils/date";
import { Calendar, ClipboardText, Key, List, ShieldCheck, SignOut, SquaresFour, Users } from "@phosphor-icons/react";
export default function AdminDashboardPage() {
  const dashboard = useDashboard();
  const { loading, adminUser, role, chapters, errorMessage, activeTab, setActiveTab, confirmModal, setConfirmModal, fetchData, handleSignOut, displayedChapters, displayedEvents, mustChangePassword } = dashboard;
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted animate-pulse">
          Verifying Session Credentials...
        </span>
      </div>
    );
  }

  if (mustChangePassword) {
    return (
      <div className="page-container py-12 md:py-16 flex flex-col items-center">
        <div className="w-full max-w-xl space-y-6">
          <div className="border-b border-line pb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 bg-brand rounded-none" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                Admin Session // Password Change Required
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-ink mt-2">
              Set a New Password
            </h1>
            <p className="text-xs font-mono text-muted mt-1">
              Logged in as <span className="text-brand font-bold">@{adminUser}</span>
            </p>
          </div>

          <div className="bg-amber-50 border-l-2 border-amber-500 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-amber-700 font-bold">Action required</p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Your account is using a temporary password, so the dashboard is locked. Enter the password you signed in with and choose a new one below. You will be asked to sign in again after the change.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-l-2 border-red-500 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-bold">Error</p>
              <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
            </div>
          )}

          <AccountPanel dashboard={dashboard} />

          <button
            onClick={handleSignOut}
            className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-transparent hover:bg-ink hover:text-white px-5 text-xs font-mono uppercase tracking-wider text-ink transition-colors duration-150 rounded-none cursor-pointer"
          >
            <SignOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-12 md:py-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-line pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 bg-brand rounded-none" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
              Admin Session // Active
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-ink mt-2">
            Control Console
          </h1>
          <p className="text-xs font-mono text-muted mt-1">
            Logged in as <span className="text-brand font-bold">@{adminUser}</span>
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-transparent hover:bg-ink hover:text-white px-5 text-xs font-mono uppercase tracking-wider text-ink transition-colors duration-150 rounded-none cursor-pointer self-start md:self-auto"
        >
          <SignOut size={14} />
          Sign Out
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-l-2 border-red-500 p-4 mt-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-bold">Error</p>
          <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="border border-line bg-surface p-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
            {"// Registered Chapters"}
          </span>
          <p className="text-3xl font-extrabold text-brand mt-2 font-mono">
            {displayedChapters.length.toString().padStart(2, "0")}
          </p>
        </div>
        <div className="border border-line bg-surface p-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
            {"// Total Active Events"}
          </span>
          <p className="text-3xl font-extrabold text-brand mt-2 font-mono">
            {displayedEvents.filter(event => event.status === "verified" && !isEventPassed(event.date)).length.toString().padStart(2, "0")}
          </p>
        </div>
        <div className="border border-line bg-surface p-6 flex flex-col justify-between">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
            {"// Security Status"}
          </span>
          <div className="flex items-center gap-2 mt-2 text-emerald-600">
            <ShieldCheck size={24} weight="bold" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {role === "superadmin" ? "SUPER ADMIN ACCESS" : "SUB ADMIN ACCESS"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Panel layout with Sidebar Tabs for improved Desktop responsiveness and focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">

        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border border-line p-2 bg-surface no-scrollbar">
          {/* Events Tab */}
          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${activeTab === "events"
                ? "bg-ink text-white border-ink font-bold"
                : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
              }`}
          >
            <Calendar size={16} />
            Events Directory
          </button>

          {/* Chapters Tab */}
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${activeTab === "chapters"
                ? "bg-ink text-white border-ink font-bold"
                : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
              }`}
          >
            <List size={16} />
            {role === "subadmin" ? "My Chapter & Logo" : "SB Chapters"}
          </button>

          {/* Clusters Tab (Superadmin only) */}
          {role === "superadmin" && (
            <button
              onClick={() => setActiveTab("clusters")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${activeTab === "clusters"
                  ? "bg-ink text-white border-ink font-bold"
                  : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
                }`}
            >
              <SquaresFour size={16} />
              Clusters
            </button>
          )}

          {/* Feedback Review Tab (Superadmin only) */}
          {role === "superadmin" && (
            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${activeTab === "feedback"
                  ? "bg-ink text-white border-ink font-bold"
                  : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
                }`}
            >
              <ClipboardText size={16} />
              Feedback Review
            </button>
          )}

          {/* Sub-Admins Tab (Superadmin only) */}
          {role === "superadmin" && (
            <button
              onClick={() => setActiveTab("subadmins")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${activeTab === "subadmins"
                  ? "bg-ink text-white border-ink font-bold"
                  : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
                }`}
            >
              <Users size={16} />
              Sub-Admins
            </button>
          )}

          {/* Password & Security Tab */}
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap lg:w-full rounded-none ${activeTab === "account"
                ? "bg-ink text-white border-ink font-bold"
                : "bg-transparent text-muted border-transparent hover:bg-surface-soft hover:text-ink"
              }`}
          >
            <Key size={16} />
            Password & Security
          </button>
        </div>

        {/* Right Column: Dynamic Panel Content */}
        <div className="lg:col-span-9 space-y-6">

          {activeTab === "events" && <EventsPanel dashboard={dashboard} />}

          {activeTab === "chapters" && <ChaptersPanel dashboard={dashboard} />}

          {activeTab === "clusters" && role === "superadmin" && (
            <ClusterManagerPanel chapters={chapters} onChaptersChanged={() => fetchData()} />
          )}

          {activeTab === "feedback" && role === "superadmin" && (
            <FeedbackReviewPanel chapters={chapters} />
          )}

          {activeTab === "subadmins" && role === "superadmin" && <SubAdminsPanel dashboard={dashboard} />}

          {activeTab === "account" && <AccountPanel dashboard={dashboard} />}

        </div>
      </div>

      <ConfirmDialog open={confirmModal.isOpen} message={confirmModal.message} onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} onConfirm={confirmModal.onConfirm} />
    </div>
  );

}
