import { ReactNode } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/current-user";

type ClientLayoutProps = {
  children: ReactNode;
};

export default async function ClientLayout({
  children,
}: ClientLayoutProps) {
  const user =
    await getCurrentUser();

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}