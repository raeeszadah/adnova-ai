import { cn } from "@/lib/utils";
import {
  siFacebook,
  siGithub,
  siGoogle,
  siInstagram,
  siX,
  siYoutube,
} from "simple-icons";
import type { FOOTER_SOCIAL } from "@/lib/footer-config";

export type SocialNetwork = keyof typeof FOOTER_SOCIAL | "google";

type SimpleIconData = { path: string; title: string };

/** LinkedIn brand path (simple-icons slug removed in v14+). */
const LINKEDIN_ICON: SimpleIconData = {
  title: "LinkedIn",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const SOCIAL_ICON_DATA: Partial<Record<SocialNetwork, SimpleIconData>> = {
  instagram: siInstagram,
  linkedin: LINKEDIN_ICON,
  github: siGithub,
  youtube: siYoutube,
  twitter: siX,
  facebook: siFacebook,
  google: siGoogle,
};

export type SocialIconProps = {
  network: SocialNetwork;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function SocialIcon({
  network,
  className,
  size = "md",
}: SocialIconProps) {
  const data = SOCIAL_ICON_DATA[network];
  if (!data) return null;

  const sizeClass = SIZE_CLASSES[size];

  return (
    <svg
      role="img"
      aria-label={data.title}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        sizeClass,
        "shrink-0 fill-current transition-colors duration-300",
        className
      )}
    >
      <path d={data.path} />
    </svg>
  );
}
