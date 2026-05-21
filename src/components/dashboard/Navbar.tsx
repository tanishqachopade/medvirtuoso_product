import Image from "next/image";

import {
  Bell,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-16 bg-[#071739] border-b border-white/10 flex items-center justify-between px-6">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo/logo.png"
          alt="MedVirtuoso Logo"
          width={52}
height={52}
          
          priority
          className="rounded-md"
        />

        <div>
          <h1 className="text-lg font-semibold tracking-wide text-white">
            MEDVIRTUOSO
          </h1>

          <p className="text-[11px] text-blue-100">
            MedMarvel Software Solutions
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* NOTIFICATIONS */}
        <button className="relative text-white/80 hover:text-white transition">
          <Bell size={19} />

          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-xl bg-red-500"></span>
        </button>

        {/* USER */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>

          <div className="leading-tight">
            <p className="text-sm font-medium text-white">
              Amit
            </p>

            <p className="text-xs text-blue-100">
              Client User
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition">
          <LogOut size={16} />

          Logout
        </button>
      </div>
    </div>
  );
}