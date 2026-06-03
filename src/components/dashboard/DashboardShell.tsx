import { ReactNode } from "react";

import Navbar from "./Navbar";

type DashboardShellProps = {
  children: ReactNode;
  user: any;
};

export default function DashboardShell({
  children,
  user,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar user={user} />

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}