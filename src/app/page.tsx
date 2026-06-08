"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      
      <Image
        src="/MedMarvelLogo.jpg"
        alt="MedMarvel Logo"
        width={180}
        height={180}
        priority
        className="mb-6"
      />

      <h1 className="text-5xl font-bold text-blue-700 text-center">
        MEDMARVEL
      </h1>

      <p className="mt-2 text-xl text-gray-600 text-center">
        Software Solutions
      </p>

      <button
        onClick={() => router.push("/login")}
        className="mt-10 px-10 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Login
      </button>

    </main>
  );
}