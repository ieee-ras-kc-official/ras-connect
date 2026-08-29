"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/config/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("admin_token", data.token);
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-12 md:py-20 flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-120px)]">
      <div className="w-full max-w-[360px]">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            Security Control
          </span>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-ink">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-xs font-mono tracking-wider text-muted">
            Access chapter management system
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-line bg-surface-soft/40 p-6 text-center rounded-none"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-brand font-bold">
              Access Granted
            </p>
            <p className="mt-2 text-sm text-muted">
              Welcome, Administrator. Connecting to database...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border-l-2 border-red-500 p-3 text-left rounded-none"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-bold">
                  Error
                </p>
                <p className="mt-0.5 text-xs text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Username Input */}
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                placeholder="Enter admin username"
                className="mt-1 w-full bg-transparent py-2.5 border-b border-line text-base text-ink outline-none focus:outline-none focus:ring-0 focus:border-line focus-visible:outline-none focus-visible:ring-0 focus-visible:border-line active:border-line placeholder:text-muted/60 rounded-none shadow-none focus:shadow-none active:shadow-none focus:bg-transparent active:bg-transparent"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                placeholder="Enter password"
                className="mt-1 w-full bg-transparent py-2.5 border-b border-line text-base text-ink outline-none focus:outline-none focus:ring-0 focus:border-line focus-visible:outline-none focus-visible:ring-0 focus-visible:border-line active:border-line placeholder:text-muted/60 rounded-none shadow-none focus:shadow-none active:shadow-none focus:bg-transparent active:bg-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 min-h-12 bg-ink text-white font-mono text-xs uppercase tracking-wider transition-colors hover:bg-brand rounded-none disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
