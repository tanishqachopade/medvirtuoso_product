"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.role === "OPERATOR") {
        router.push("/operator/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#070b14" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-8"
        style={{
          background: "rgba(13,19,33,0.85)",
          border: "1px solid rgba(59,130,246,0.18)",
          backdropFilter: "blur(16px)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Link href="/" className="flex items-center justify-center rounded-2xl" style={{
            width: 72,
            height: 72,
            background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))",
            border: "1px solid rgba(59,130,246,0.3)",
            boxShadow: "0 0 32px rgba(59,130,246,0.12)",
          }}>
            <Image
              src="/logo/logo.png"
              alt="MedMarvel"
              width={50}
              height={50}
              style={{ objectFit: "contain", borderRadius: "8px" }}
              priority
            />
          </Link>

          <div className="text-center">
            <h1
              className="text-xl font-black tracking-tight leading-tight"
              style={{
                background:
                  "linear-gradient(135deg,#ffffff 0%,#93c5fd 55%,#a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MedMarvel Software Solutions
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.7)" }}>
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(148,163,184,0.8)" }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "#e2e8f0",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59,130,246,0.6)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59,130,246,0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(148,163,184,0.8)" }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "#e2e8f0",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59,130,246,0.6)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59,130,246,0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: loading
                ? "rgba(59,130,246,0.5)"
                : "linear-gradient(135deg,#3b82f6,#7c3aed)",
              boxShadow: loading
                ? "none"
                : "0 4px 20px rgba(59,130,246,0.3)",
              marginTop: "0.25rem",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Back link */}
        <p className="text-center text-xs mt-6" style={{ color: "rgba(100,116,139,0.7)" }}>
          <Link
            href="/"
            className="transition-colors hover:text-blue-400"
            style={{ color: "rgba(148,163,184,0.6)" }}
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}