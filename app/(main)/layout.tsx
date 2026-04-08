import { DashboardShell } from "@/components/dashboard-shell";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return <DashboardShell>{children}</DashboardShell>;
}
