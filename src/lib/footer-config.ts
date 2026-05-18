/**
 * Social & footer links — update URLs here or via .env (NEXT_PUBLIC_SOCIAL_*).
 * Leave empty string to hide an icon.
 */
export const FOOTER_SOCIAL = {
  instagram:
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ??
    "https://www.instagram.com/tecoritham",
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
  github:
    process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "https://github.com/raeeszadah",
  youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER ?? "",
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
} as const;

export const FOOTER_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";

export const TEAM_NOVA_MINDS = [
  "Mohammad Raees",
  "Harshada Chavan",
  "Akash Chavan",
  "Shubham Singh",
] as const;

export const PROJECT_GUIDE = {
  name: "Prof. Manali Raut",
  department: "Department of Electronics and Computer Engineering",
  university: "MIT ADT University",
} as const;

export const AI_TECHNOLOGIES = [
  "HeyGen Avatars",
  "Remotion",
  "Gemini / OpenRouter",
  "Convex",
  "Clerk Auth",
] as const;

export const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Create", href: "/dashboard/create" },
  { label: "My Videos", href: "/dashboard/videos" },
  { label: "Pricing", href: "/dashboard/billing" },
] as const;

/** Compact footer links for authenticated app shells (dashboard / admin). */
export const APP_SHELL_FOOTER_NAV = {
  dashboard: [
    { label: "Overview", href: "/dashboard" },
    { label: "Create", href: "/dashboard/create" },
    { label: "Videos", href: "/dashboard/videos" },
    { label: "Billing", href: "/dashboard/billing" },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Videos", href: "/admin/videos" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "API Logs", href: "/admin/api-logs" },
  ],
} as const;

export type AppShellFooterVariant = keyof typeof APP_SHELL_FOOTER_NAV;
