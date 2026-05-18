/** Optional demo video URL — set NEXT_PUBLIC_DEMO_VIDEO_URL in .env */
export const DEMO_VIDEO_URL =
  process.env.NEXT_PUBLIC_DEMO_VIDEO_URL?.trim() ?? "";

export const LANDING_NOTIFICATIONS = [
  {
    id: "welcome",
    title: "Welcome to AdNova AI",
    body: "Create your first AI avatar product video in minutes.",
    href: "/dashboard/create",
    time: "Just now",
  },
  {
    id: "credits",
    title: "Starter credits ready",
    body: "Your account includes credits to generate demo ads.",
    href: "/dashboard",
    time: "Today",
  },
  {
    id: "videos",
    title: "Track your renders",
    body: "View processing status and downloads in My Videos.",
    href: "/dashboard/videos",
    time: "Today",
  },
] as const;
