/** Route → app shell header label (responsive nav context only). */
export const SHELL_HEADER_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/create": "Create Video",
  "/dashboard/videos": "My Videos",
  "/dashboard/billing": "Billing",
  "/admin/dashboard": "Platform overview",
  "/admin/users": "User management",
  "/admin/videos": "Video monitoring",
  "/admin/analytics": "Analytics",
  "/admin/api-logs": "API logs",
};

export function resolveShellHeaderTitle(
  pathname: string | null,
  fallback: string
): string {
  if (!pathname) return fallback;
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return SHELL_HEADER_TITLES[normalized] ?? fallback;
}
