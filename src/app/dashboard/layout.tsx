import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { AppShellFooter } from "@/components/layout/AppShellFooter";
import { AppShellLayout } from "@/components/layout/AppShellLayout";
import { SidebarNav } from "./SidebarNav";
import { CreditsWidget } from "./CreditsWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellLayout
      headerTitle="Dashboard"
      headerActions={<UserButton />}
      sidebarBrand={
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center transition-opacity hover:opacity-90"
          aria-label="AdNova AI home"
        >
          <BrandLogo size="lg" />
        </Link>
      }
      sidebarNav={<SidebarNav />}
      sidebarFooter={<CreditsWidget />}
      footer={<AppShellFooter variant="dashboard" />}
    >
      {children}
    </AppShellLayout>
  );
}
