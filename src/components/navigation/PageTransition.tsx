"use client";

import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "root" | "dashboard" | "none";
};

export function PageTransition({
  children,
  className,
  variant = "root",
}: PageTransitionProps) {
  const pathname = usePathname();

  if (variant === "none") {
    return <>{children}</>;
  }

  if (variant === "root") {
    if (pathname.startsWith("/dashboard")) {
      return <>{children}</>;
    }
    return (
      <div key={pathname} className={className ?? "page-enter min-h-full w-full"}>
        {children}
      </div>
    );
  }

  return (
    <div
      key={pathname}
      className={className ?? "page-enter-dashboard min-h-full w-full"}
    >
      {children}
    </div>
  );
}
