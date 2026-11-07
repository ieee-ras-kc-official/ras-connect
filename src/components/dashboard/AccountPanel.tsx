"use client";
import type { useDashboard } from "@/hooks/use-dashboard";
import { Key } from "@phosphor-icons/react";
export function AccountPanel({ dashboard }: { dashboard: ReturnType<typeof useDashboard> }) {
  const { adminUser, role, currentPassword, setCurrentPassword, mustChangePassword, selfNewPassword, setSelfNewPassword, selfConfirmPassword, setSelfConfirmPassword, changingPassword, handleSelfPasswordChange } = dashboard;
  return (<div className="border border-line p-6 bg-surface max-w-2xl">
    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-brand block mb-2">
      {"// Security Credentials"}
    </span>
    <h2 className="text-lg font-bold uppercase tracking-tight text-ink border-b border-line pb-2 mb-4">
      Password Reset
    </h2>

    <p className="text-xs font-mono text-muted mb-6 leading-relaxed">
      Update the password for your account <span className="text-brand font-bold">@{adminUser}</span> ({role === "superadmin" ? "Super Admin" : "Sub-Admin"}).
    </p>

    <form onSubmit={handleSelfPasswordChange} className="space-y-4">
      {mustChangePassword && <p role="status">Change your temporary password to unlock chapter management.</p>}
      <div><label htmlFor="current-password">Current password</label><input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full border-b border-line py-2" /></div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-13">
          New Password (Minimum 10 characters)
        </label>
        <input id="dashboard-field-13"
          type="password" minLength={10} maxLength={72} autoComplete="new-password"
          required
          value={selfNewPassword}
          onChange={(e) => setSelfNewPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1" htmlFor="dashboard-field-14">
          Confirm New Password
        </label>
        <input id="dashboard-field-14"
          type="password" minLength={10} maxLength={72} autoComplete="new-password"
          required
          value={selfConfirmPassword}
          onChange={(e) => setSelfConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-transparent py-2.5 border-b border-line text-sm text-ink outline-none focus:border-brand transition-colors rounded-none"
        />
      </div>

      <button
        type="submit"
        disabled={changingPassword}
        className="w-full min-h-12 bg-ink text-white font-mono text-xs uppercase tracking-wider transition-colors hover:bg-brand disabled:opacity-50 rounded-none flex items-center justify-center gap-2 mt-6"
      >
        {changingPassword ? (
          <span className="animate-pulse">Updating Password...</span>
        ) : (
          <>
            <Key size={14} />
            Update My Password
          </>
        )}
      </button>
    </form>
  </div>);
}
