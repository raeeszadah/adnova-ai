import { PageTransition } from "@/components/navigation/PageTransition";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition variant="root">{children}</PageTransition>;
}
