import { ReactNode } from "react";

import Navbar from "./Navbar";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}