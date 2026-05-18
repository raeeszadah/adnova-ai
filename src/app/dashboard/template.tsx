import { PageTransition } from "@/components/navigation/PageTransition";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition variant="dashboard">{children}</PageTransition>;
}
