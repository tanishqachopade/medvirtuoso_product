import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedMarvel Software Solutions",
  description:
    "MedMarvel Software Solutions – Advanced medical imaging and diagnostics platform for healthcare professionals.",
};

export default function Home() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #f0f4ff 0%, #ffffff 50%, #eef2fb 100%)",
      }}
    >
      {/* Very subtle top-left accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full h-1"
        style={{ background: "linear-gradient(90deg, #2563eb, #3b82f6, #6366f1)" }}
      />

      {/* Soft radial tint — bottom right */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-7 px-8 py-20 text-center">

        {/* Logo */}
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: 104,
            height: 104,
            background: "#ffffff",
            border: "1px solid rgba(37,99,235,0.15)",
            boxShadow:
              "0 4px 24px rgba(37,99,235,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <Image
            src="/logo/logo.png"
            alt="MedMarvel Software Solutions logo"
            width={72}
            height={72}
            style={{ objectFit: "contain", borderRadius: "10px" }}
            priority
          />
        </div>

        {/* Company name */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="font-bold tracking-tight leading-tight"
            style={{
              fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
              color: "#0f172a",
            }}
          >
            MedMarvel Software Solutions
          </h1>

          {/* Thin blue underline accent */}
          <div
            className="rounded-full"
            style={{
              width: 48,
              height: 3,
              background: "linear-gradient(90deg, #2563eb, #6366f1)",
              marginTop: 2,
            }}
          />

          <p
            className="text-base font-medium mt-1"
            style={{ color: "#64748b", letterSpacing: "0.02em" }}
          >
            Advanced Medical Imaging Platform
          </p>
        </div>

        {/* Login CTA */}
        <Link
          id="btn-login"
          href="/login"
          className="inline-flex items-center justify-center rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{
            padding: "0.75rem 3rem",
            minWidth: 168,
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            boxShadow:
              "0 4px 16px rgba(37,99,235,0.30), 0 1px 0 rgba(255,255,255,0.12) inset",
            marginTop: 8,
          }}
        >
          Login
        </Link>

        {/* Footer */}
        <p
          className="text-xs mt-6"
          style={{ color: "#94a3b8" }}
        >
          © {new Date().getFullYear()} MedMarvel Software Solutions. All rights reserved.
        </p>
      </main>
    </div>
  );
}
